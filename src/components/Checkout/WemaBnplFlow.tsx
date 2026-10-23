import React, { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  AlertCircle,
  ArrowLeft,
  BadgeCheck,
  CheckCircle2,
  Landmark,
  Loader2,
  Smartphone,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice } from "@/lib/productUtils";
import {
  WEMA_BNPL,
  clearWemaSession,
  estimateWemaPlan,
  isValidAccountNumber,
  loadWemaSession,
  maskAccountNumber,
  saveWemaSession,
  type WemaSession,
} from "@/lib/wemaBnpl";
import { cleanWemaError, isWemaExpiredError, wemaBnplApi, type WemaLoanOffer } from "@/api/wemaBnpl";

const POLL_INTERVAL_MS = 5000;

const formatScheduleDate = (iso: string) => {
  const date = new Date(iso);
  return Number.isNaN(date.getTime())
    ? iso
    : date.toLocaleDateString("en-NG", { day: "numeric", month: "short", year: "numeric" });
};
/** After 8 min tell the buyer it is taking longer; stop checking at 10 min */
const APPROVAL_SLOW_MS = 8 * 60 * 1000;
const APPROVAL_TIMEOUT_MS = 10 * 60 * 1000;
const EQUITY_PRESETS = [0.2, 0.3, 0.5];

export interface WemaBnplResult {
  consentId: string;
  loanEligibilityId: string;
  merchantCustomerReference: string | null;
  accountNumber: string;
  productAmount: number;
  equityAmount: number;
  tenure: number;
}

type Step = "plan" | "approve" | "offer" | "disbursing" | "done";

interface WemaBnplFlowProps {
  open: boolean;
  /** Amount being financed (checkout total) */
  productAmount: number;
  onClose: () => void;
  /** Called after Wema disburses the loan; the parent places the order. */
  onComplete: (result: WemaBnplResult) => Promise<void> | void;
}

const STEPS: Array<{ id: Step; label: string }> = [
  { id: "plan", label: "Plan" },
  { id: "approve", label: "Approve" },
  { id: "offer", label: "Confirm" },
];

const WemaBnplFlow: React.FC<WemaBnplFlowProps> = ({
  open,
  productAmount,
  onClose,
  onComplete,
}) => {
  const [step, setStep] = useState<Step>("plan");
  const [accountNumber, setAccountNumber] = useState("");
  const [tenure, setTenure] = useState<number>(WEMA_BNPL.maxTenure);
  const [equityRate, setEquityRate] = useState<number>(WEMA_BNPL.minEquityRate);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [showTerms, setShowTerms] = useState(false);
  const [showSchedule, setShowSchedule] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [session, setSession] = useState<WemaSession | null>(null);
  const [offer, setOffer] = useState<WemaLoanOffer | null>(null);
  const [approvalTimedOut, setApprovalTimedOut] = useState(false);
  const [approvalSlow, setApprovalSlow] = useState(false);
  const checkingRef = useRef(false);

  const estimate = estimateWemaPlan(productAmount, equityRate, tenure);
  // Include a non-preset rate (e.g. the minimum Wema requires) as its own option
  const equityOptions = EQUITY_PRESETS.some((rate) => Math.abs(rate - equityRate) < 0.001)
    ? EQUITY_PRESETS
    : [...EQUITY_PRESETS, equityRate].sort((a, b) => a - b);
  const accountValid = isValidAccountNumber(accountNumber);

  // Resume an application in progress (e.g. tab reloaded after switching to ALAT)
  useEffect(() => {
    if (!open) return;
    const saved = loadWemaSession(productAmount);
    if (saved) {
      setSession(saved);
      setAccountNumber(saved.accountNumber);
      setTenure(saved.tenure);
      setEquityRate(saved.equityAmount / saved.productAmount);
      setStep("approve");
    }
  }, [open, productAmount]);

  // Lock page scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const resetToPlan = () => {
    clearWemaSession();
    setSession(null);
    setOffer(null);
    setTermsAccepted(false);
    setApprovalTimedOut(false);
    setApprovalSlow(false);
    setError(null);
    setStep("plan");
  };

  const handleSendRequest = async () => {
    if (!accountValid) {
      setError("Enter your 10-digit Wema/ALAT account number.");
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const res = await wemaBnplApi.requestConsent({
        accountNumber,
        productAmount: estimate.productAmount,
        equityAmount: estimate.equityAmount,
        tenure,
        productId: WEMA_BNPL.productId,
      });
      const next: WemaSession = {
        consentId: res.consentId,
        productAmount: estimate.productAmount,
        equityAmount: estimate.equityAmount,
        tenure,
        accountNumber,
        accountName: res.accountName,
        merchantCustomerReference: null, // returned later by consent-status
        startedAt: Date.now(),
      };
      saveWemaSession(next);
      setSession(next);
      setApprovalTimedOut(false);
    setApprovalSlow(false);
      setStep("approve");
    } catch (e) {
      setError(cleanWemaError(e));
    } finally {
      setBusy(false);
    }
  };

  /** Checks consent; once approved, immediately fetches the loan offer. */
  const checkApproval = useCallback(
    async (manual = false) => {
      if (!session || checkingRef.current) return;
      checkingRef.current = true;
      if (manual) {
        setBusy(true);
        setError(null);
      }
      try {
        const status = await wemaBnplApi.getConsentStatus(session.consentId);
        if (status.state === "declined") {
          clearWemaSession();
          setError("The request was declined in the ALAT app. You can try again or choose another payment method.");
          setSession(null);
          setStep("plan");
          return;
        }
        if (status.state === "expired") {
          setApprovalTimedOut(true);
          return;
        }
        if (status.state === "approved" && status.eligibilityId) {
          const updated: WemaSession = {
            ...session,
            merchantCustomerReference:
              status.merchantCustomerReference ?? session.merchantCustomerReference,
          };
          saveWemaSession(updated);
          setSession(updated);

          // Wema lends at most prequalifiedAmount; ask for a bigger down payment if needed
          const loanAmount = session.productAmount - session.equityAmount;
          if (status.prequalifiedAmount !== undefined && loanAmount > status.prequalifiedAmount) {
            const minEquity = session.productAmount - status.prequalifiedAmount;
            const minRate = Math.min(
              WEMA_BNPL.maxEquityRate,
              Math.ceil((minEquity / session.productAmount) * 100) / 100
            );
            clearWemaSession();
            setSession(null);
            setEquityRate(minRate);
            setStep("plan");
            setError(
              minEquity / session.productAmount > WEMA_BNPL.maxEquityRate
                ? `Wema can lend you up to ${formatPrice(status.prequalifiedAmount)}, which isn't enough for this order. Please choose another payment method.`
                : `Wema can lend you up to ${formatPrice(status.prequalifiedAmount)}. Increase your down payment to at least ${formatPrice(minEquity)} and send a new request.`
            );
            return;
          }

          try {
            const loanOffer = await wemaBnplApi.checkEligibility({
              consentId: session.consentId,
              productId: WEMA_BNPL.productId,
              incomeEligibilityId: status.eligibilityId,
            });
            setOffer(loanOffer);
            setError(null);
            setStep("offer");
          } catch (eligibilityError) {
            // e.g. "Customer has a pending disbursement" — stop polling and explain
            clearWemaSession();
            setSession(null);
            setStep("plan");
            setError(cleanWemaError(eligibilityError));
          }
        } else if (manual) {
          setError("Still waiting for your approval on ALAT. Open the ALAT app and tap Approve.");
        }
      } catch (e) {
        if (manual) setError(cleanWemaError(e));
      } finally {
        checkingRef.current = false;
        if (manual) setBusy(false);
      }
    },
    [session]
  );

  // Poll while waiting for approval; also check as soon as the buyer returns from ALAT
  useEffect(() => {
    if (!open || step !== "approve" || !session || approvalTimedOut) return;

    const timer = window.setInterval(() => {
      const elapsed = Date.now() - session.startedAt;
      if (elapsed > APPROVAL_TIMEOUT_MS) {
        setApprovalTimedOut(true);
        return;
      }
      setApprovalSlow(elapsed > APPROVAL_SLOW_MS);
      if (!document.hidden) void checkApproval();
    }, POLL_INTERVAL_MS);
    const onVisible = () => {
      if (!document.hidden) void checkApproval();
    };
    document.addEventListener("visibilitychange", onVisible);
    void checkApproval();

    return () => {
      window.clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [open, step, session, approvalTimedOut, checkApproval]);

  const handleConfirm = async () => {
    if (!offer || !session || !termsAccepted) return;
    setBusy(true);
    setError(null);
    setStep("disbursing");
    try {
      await wemaBnplApi.disburse(offer.loanEligibilityId);
      clearWemaSession();
      setStep("done");
      await onComplete({
        consentId: session.consentId,
        loanEligibilityId: offer.loanEligibilityId,
        merchantCustomerReference: session.merchantCustomerReference,
        accountNumber: session.accountNumber,
        productAmount: session.productAmount,
        equityAmount: session.equityAmount,
        tenure: session.tenure,
      });
    } catch (e) {
      setError(cleanWemaError(e));
      if (isWemaExpiredError(e)) {
        // The offer can't be reused; start a fresh application
        clearWemaSession();
        setSession(null);
        setOffer(null);
        setTermsAccepted(false);
        setStep("plan");
      } else {
        setStep("offer");
      }
    } finally {
      setBusy(false);
    }
  };

  if (!open) return null;

  const stepIndex = STEPS.findIndex((s) => s.id === step);
  const canClose = step !== "disbursing";

  const durationMonths = offer?.instalmentCount || session?.tenure || tenure;

  const summaryRows = (
    <dl className="divide-y divide-gray-100 rounded-xl border border-gray-200 text-sm">
      {[
        ["Order total", formatPrice(session?.productAmount ?? estimate.productAmount)],
        ["Down payment", formatPrice(session?.equityAmount ?? estimate.equityAmount)],
        [
          "Financed by Wema",
          formatPrice(session ? session.productAmount - session.equityAmount : estimate.loanAmount),
        ],
        ["Duration", `${durationMonths} month${durationMonths === 1 ? "" : "s"}`],
      ].map(([label, value]) => (
        <div key={label} className="flex items-center justify-between px-4 py-2.5">
          <dt className="text-gray-500">{label}</dt>
          <dd className="font-medium text-gray-900">{value}</dd>
        </div>
      ))}
    </dl>
  );

  return createPortal(
    <div className="fixed inset-0 z-[10000] flex items-end justify-center sm:items-center" role="dialog" aria-modal="true" aria-labelledby="wema-bnpl-title">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => canClose && onClose()}
        aria-hidden
      />

      <div className="relative flex max-h-[92vh] w-full flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:max-w-md sm:rounded-2xl">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-gray-100 px-5 py-4">
          {(step === "approve" || step === "offer") && (
            <button
              type="button"
              onClick={resetToPlan}
              className="-ml-1 rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
              aria-label="Change plan"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
          )}
          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#5B2C83]/10">
            <Landmark className="h-5 w-5 text-[#5B2C83]" aria-hidden />
          </div>
          <div className="min-w-0 flex-1">
            <h2 id="wema-bnpl-title" className="font-semibold text-gray-900">
              Pay later with Wema
            </h2>
            <p className="text-xs text-gray-500">Approve with your ALAT app</p>
          </div>
          {canClose && (
            <button
              type="button"
              onClick={onClose}
              className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          )}
        </div>

        {/* Progress */}
        {stepIndex >= 0 && (
          <ol className="flex items-center gap-2 px-5 pt-4">
            {STEPS.map((s, i) => (
              <li key={s.id} className="flex flex-1 flex-col gap-1.5">
                <span
                  className={cn(
                    "h-1.5 rounded-full transition-colors",
                    i <= stepIndex ? "bg-primary" : "bg-gray-200"
                  )}
                />
                <span className={cn("text-[11px] font-medium", i <= stepIndex ? "text-primary" : "text-gray-400")}>
                  {i + 1}. {s.label}
                </span>
              </li>
            ))}
          </ol>
        )}

        <div className="flex-1 overflow-y-auto px-5 py-5">
          {error && (
            <div className="mb-4 flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700" role="alert">
              <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" aria-hidden />
              <span>{error}</span>
            </div>
          )}

          {/* STEP 1 — choose plan */}
          {step === "plan" && (
            <div className="space-y-5">
              <div>
                <label htmlFor="wema-account" className="mb-1.5 block text-sm font-medium text-gray-900">
                  Wema / ALAT account number
                </label>
                <input
                  id="wema-account"
                  inputMode="numeric"
                  autoComplete="off"
                  maxLength={10}
                  placeholder="10-digit account number"
                  value={accountNumber}
                  onChange={(e) => {
                    setAccountNumber(e.target.value.replace(/\D/g, "").slice(0, 10));
                    if (error) setError(null);
                  }}
                  className="h-11 w-full rounded-lg border border-gray-300 px-3 text-base tracking-wider transition-colors hover:border-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                />
                <p className="mt-1.5 text-xs text-gray-500">
                  Don't have one? Open an ALAT account in minutes on the ALAT app.
                </p>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-900">Pay over</p>
                <div className="grid grid-cols-6 gap-1.5">
                  {Array.from({ length: WEMA_BNPL.maxTenure - WEMA_BNPL.minTenure + 1 }, (_, i) => i + WEMA_BNPL.minTenure).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setTenure(m)}
                      className={cn(
                        "h-10 rounded-lg border text-sm font-medium transition-colors",
                        tenure === m
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 text-gray-700 hover:border-primary"
                      )}
                      aria-pressed={tenure === m}
                    >
                      {m}m
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-gray-900">Down payment</p>
                <div className="flex gap-1.5">
                  {equityOptions.map((rate) => (
                    <button
                      key={rate}
                      type="button"
                      onClick={() => setEquityRate(rate)}
                      className={cn(
                        "h-10 flex-1 rounded-lg border text-sm font-medium transition-colors",
                        Math.abs(equityRate - rate) < 0.001
                          ? "border-primary bg-primary text-white"
                          : "border-gray-300 text-gray-700 hover:border-primary"
                      )}
                      aria-pressed={Math.abs(equityRate - rate) < 0.001}
                    >
                      {Math.round(rate * 100)}%
                    </button>
                  ))}
                </div>
                <p className="mt-1.5 text-xs text-gray-500">
                  Paying more upfront lowers your monthly repayment.
                </p>
              </div>

              <div className="rounded-xl bg-[#8DEB6E]/15 p-4">
                <p className="text-xs font-medium uppercase tracking-wide text-primary/80">Estimated repayment</p>
                <p className="mt-1 text-2xl font-bold text-primary">
                  {formatPrice(estimate.monthlyRepayment)}
                  <span className="text-sm font-medium text-primary/80"> / month</span>
                </p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <div>
                    <p className="text-xs text-gray-600">Pay today</p>
                    <p className="font-semibold text-gray-900">{formatPrice(estimate.equityAmount)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Wema finances</p>
                    <p className="font-semibold text-gray-900">{formatPrice(estimate.loanAmount)}</p>
                  </div>
                </div>
                <p className="mt-3 text-[11px] leading-snug text-gray-600">
                  Estimate at {Math.round(WEMA_BNPL.annualInterestRate * 100)}% p.a. plus ~
                  {formatPrice(estimate.upfrontFees)} in fees. Wema confirms your exact terms before anything is charged.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2 — approve in ALAT */}
          {step === "approve" && session && (
            <div className="space-y-5 text-center">
              {approvalTimedOut ? (
                <>
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-50">
                    <AlertCircle className="h-8 w-8 text-amber-500" aria-hidden />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Approval request expired</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      We didn't get an approval in time. Send a new request to try again.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <div className="relative mx-auto flex h-20 w-20 items-center justify-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-[#8DEB6E]/30 [animation-duration:2s]" aria-hidden />
                    <span className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#8DEB6E]/25">
                      <Smartphone className="h-9 w-9 text-primary" aria-hidden />
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">Approve in your ALAT app</h3>
                    <p className="mt-1 text-sm text-gray-600">
                      We sent a request to{" "}
                      {session.accountName ? (
                        <span className="font-medium text-gray-900">{session.accountName}</span>
                      ) : (
                        "account"
                      )}{" "}
                      ({maskAccountNumber(session.accountNumber)}).
                    </p>
                  </div>
                  <ol className="space-y-2 rounded-xl border border-gray-200 p-4 text-left text-sm text-gray-700">
                    <li className="flex gap-2"><span className="font-semibold text-primary">1.</span>Open the ALAT by Wema app</li>
                    <li className="flex gap-2"><span className="font-semibold text-primary">2.</span>Find the 9jaCart pay-later request</li>
                    <li className="flex gap-2"><span className="font-semibold text-primary">3.</span>Tap <span className="font-semibold">Approve</span>, then come back here</li>
                  </ol>
                  <p className="flex items-center justify-center gap-2 text-xs text-gray-500">
                    <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
                    Waiting for customer approval on ALAT…
                  </p>
                  {approvalSlow && (
                    <p className="rounded-lg bg-amber-50 px-3 py-2 text-xs text-amber-800">
                      This is taking longer than usual. Make sure you tapped Approve in the ALAT
                      app; we'll keep checking for a couple more minutes.
                    </p>
                  )}
                </>
              )}
              {summaryRows}
            </div>
          )}

          {/* STEP 3 — confirm Wema's offer */}
          {step === "offer" && offer && (
            <div className="space-y-5">
              <div className="flex items-center gap-3 rounded-xl bg-[#8DEB6E]/15 p-4">
                <BadgeCheck className="h-8 w-8 flex-shrink-0 text-primary" aria-hidden />
                <div>
                  <p className="font-semibold text-gray-900">You're approved!</p>
                  <p className="text-sm text-gray-600">Review your loan and confirm to place your order.</p>
                </div>
              </div>
              {/* Wema's actual offer (from disbursement-eligibility) */}
              <div className="grid grid-cols-2 gap-3">
                {offer.monthlyRepayment !== undefined && (
                  <div className="rounded-xl border border-gray-200 p-3">
                    <p className="text-xs text-gray-500">Monthly repayment</p>
                    <p className="text-lg font-bold text-primary">{formatPrice(offer.monthlyRepayment)}</p>
                    <p className="text-[11px] text-gray-500">× {offer.instalmentCount} months</p>
                  </div>
                )}
                {offer.upfrontFees > 0 && (
                  <div className="rounded-xl border border-gray-200 p-3">
                    <p className="text-xs text-gray-500">Loan fees today</p>
                    <p className="text-lg font-bold text-gray-900">{formatPrice(offer.upfrontFees)}</p>
                    <p className="text-[11px] text-gray-500">VAT, management, insurance</p>
                  </div>
                )}
              </div>

              {summaryRows}

              {offer.schedule.length > 0 && (
                <div className="rounded-xl border border-gray-200">
                  <button
                    type="button"
                    onClick={() => setShowSchedule((v) => !v)}
                    className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium text-gray-900"
                    aria-expanded={showSchedule}
                  >
                    Repayment schedule
                    <span className="text-xs font-normal text-gray-500">
                      Total {formatPrice(offer.totalRepayment)} · {showSchedule ? "Hide" : "Show"}
                    </span>
                  </button>
                  {showSchedule && (
                    <ul className="divide-y divide-gray-100 border-t border-gray-100 text-sm">
                      {offer.schedule.map((entry, i) => (
                        <li key={`${entry.date}-${i}`} className="flex items-center justify-between gap-3 px-4 py-2">
                          <div className="min-w-0">
                            <p className="text-gray-900">{formatScheduleDate(entry.date)}</p>
                            <p className="truncate text-xs text-gray-500">
                              {entry.isInstalment ? "Monthly repayment (automatic)" : entry.note || "Fees"}
                            </p>
                          </div>
                          <span className="flex-shrink-0 font-medium text-gray-900">{formatPrice(entry.amount)}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}

              <label className="flex cursor-pointer items-start gap-3 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={termsAccepted}
                  onChange={(e) => setTermsAccepted(e.target.checked)}
                  className="mt-0.5 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                />
                <span>
                  I accept{" "}
                  {offer.termsHtml ? (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        setShowTerms(true);
                      }}
                      className="font-medium text-primary underline"
                    >
                      Wema Bank's loan terms
                    </button>
                  ) : (
                    "Wema Bank's loan terms"
                  )}{" "}
                  and authorise repayments from my account.
                </span>
              </label>
            </div>
          )}

          {(step === "disbursing" || step === "done") && (
            <div className="flex flex-col items-center gap-4 py-8 text-center">
              {step === "disbursing" ? (
                <Loader2 className="h-12 w-12 animate-spin text-primary" aria-hidden />
              ) : (
                <CheckCircle2 className="h-14 w-14 text-[#28a745]" aria-hidden />
              )}
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {step === "disbursing" ? "Finalising your loan…" : "Wema is processing your loan"}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {step === "disbursing"
                    ? "Please don't close this page."
                    : "Placing your order now…"}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Wema's loan agreement (HTML from the API), sandboxed so it can't run scripts */}
        {showTerms && offer?.termsHtml && (
          <div className="absolute inset-0 z-10 flex flex-col bg-white">
            <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
              <h3 className="font-semibold text-gray-900">Wema Bank loan terms</h3>
              <button
                type="button"
                onClick={() => setShowTerms(false)}
                className="rounded-full p-1.5 text-gray-500 hover:bg-gray-100"
                aria-label="Close terms"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <iframe
              title="Wema Bank loan terms"
              srcDoc={offer.termsHtml}
              sandbox=""
              className="w-full flex-1 border-0"
            />
            <div className="border-t border-gray-100 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
              <button
                type="button"
                onClick={() => {
                  setTermsAccepted(true);
                  setShowTerms(false);
                }}
                className="h-12 w-full rounded-xl bg-primary font-semibold text-white hover:bg-primary/90"
              >
                I accept these terms
              </button>
            </div>
          </div>
        )}

        {/* Footer actions */}
        <div className="border-t border-gray-100 px-5 py-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          {step === "plan" && (
            <button
              type="button"
              onClick={() => void handleSendRequest()}
              disabled={busy || !accountValid}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              Send approval request
            </button>
          )}
          {step === "approve" && (
            approvalTimedOut ? (
              <button
                type="button"
                onClick={() => {
                  resetToPlan();
                }}
                className="h-12 w-full rounded-xl bg-primary font-semibold text-white hover:bg-primary/90"
              >
                Send a new request
              </button>
            ) : (
              <button
                type="button"
                onClick={() => void checkApproval(true)}
                disabled={busy}
                className="flex h-12 w-full items-center justify-center gap-2 rounded-xl border border-primary font-semibold text-primary transition-colors hover:bg-[#8DEB6E]/15 disabled:opacity-60"
              >
                {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
                I've approved it
              </button>
            )
          )}
          {step === "offer" && (
            <button
              type="button"
              onClick={() => void handleConfirm()}
              disabled={busy || !termsAccepted}
              className="flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary font-semibold text-white transition-colors hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {busy && <Loader2 className="h-4 w-4 animate-spin" aria-hidden />}
              Confirm and place order
            </button>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default WemaBnplFlow;
