/**
 * Wema Bank BNPL product terms (productId ED132CE5-…, from the backend's Postman docs).
 * The live offer from Wema (disbursement-eligibility) is authoritative; these drive
 * the plan picker and the on-screen estimate only.
 */
export const WEMA_BNPL = {
  productId: "ED132CE5-255D-415D-8217-5AADEB652A3F",
  minAmount: 50_000,
  maxAmount: 1_000_000,
  minTenure: 1,
  maxTenure: 6,
  minEquityRate: 0.2,
  maxEquityRate: 0.8,
  annualInterestRate: 0.36,
  managementFeeRate: 0.01,
  insuranceFeeRate: 0.01,
  vatRate: 0.075,
} as const;

export type WemaEligibility =
  | { eligible: true }
  | { eligible: false; reason: string };

export function getWemaEligibility(amount: number): WemaEligibility {
  if (!Number.isFinite(amount) || amount < WEMA_BNPL.minAmount) {
    return {
      eligible: false,
      reason: `Available on orders from ₦${WEMA_BNPL.minAmount.toLocaleString("en-NG")}`,
    };
  }
  if (amount > WEMA_BNPL.maxAmount) {
    return {
      eligible: false,
      reason: `Available on orders up to ₦${WEMA_BNPL.maxAmount.toLocaleString("en-NG")}`,
    };
  }
  return { eligible: true };
}

export interface WemaPlanEstimate {
  productAmount: number;
  equityAmount: number;
  loanAmount: number;
  monthlyRepayment: number;
  totalRepayment: number;
  upfrontFees: number;
}

/** Estimate: reducing-balance amortisation at 36% p.a., plus 1% management + 1% insurance (+7.5% VAT on fees). */
export function estimateWemaPlan(
  productAmount: number,
  equityRate: number,
  tenure: number
): WemaPlanEstimate {
  const rate = Math.min(WEMA_BNPL.maxEquityRate, Math.max(WEMA_BNPL.minEquityRate, equityRate));
  const equityAmount = Math.ceil(productAmount * rate);
  const loanAmount = Math.max(0, productAmount - equityAmount);
  const monthlyRate = WEMA_BNPL.annualInterestRate / 12;
  const monthlyRepayment =
    loanAmount === 0
      ? 0
      : (loanAmount * monthlyRate) / (1 - Math.pow(1 + monthlyRate, -tenure));
  const fees = loanAmount * (WEMA_BNPL.managementFeeRate + WEMA_BNPL.insuranceFeeRate);
  const upfrontFees = fees * (1 + WEMA_BNPL.vatRate);

  return {
    productAmount,
    equityAmount,
    loanAmount,
    monthlyRepayment: Math.ceil(monthlyRepayment),
    totalRepayment: Math.ceil(monthlyRepayment * tenure),
    upfrontFees: Math.ceil(upfrontFees),
  };
}

/** NUBAN account numbers are 10 digits. */
export const isValidAccountNumber = (value: string) => /^\d{10}$/.test(value);

/**
 * In-progress application, kept in sessionStorage so a buyer who switches to the
 * ALAT app (mobile browsers often reload the tab) comes back to the same step.
 */
export interface WemaSession {
  consentId: string;
  productAmount: number;
  equityAmount: number;
  tenure: number;
  accountNumber: string;
  /** Account holder name returned by Wema, shown so the buyer can confirm the account */
  accountName: string | null;
  merchantCustomerReference: string | null;
  startedAt: number;
}

const SESSION_KEY = "9ja_wema_bnpl_session";
/** Consent prompts are not kept forever; drop stale sessions */
const SESSION_TTL_MS = 30 * 60 * 1000;

export function loadWemaSession(productAmount: number): WemaSession | null {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as WemaSession;
    const fresh = Date.now() - session.startedAt < SESSION_TTL_MS;
    // A changed cart total means a different loan; start over
    if (!fresh || session.productAmount !== productAmount) {
      sessionStorage.removeItem(SESSION_KEY);
      return null;
    }
    return session;
  } catch {
    return null;
  }
}

export function saveWemaSession(session: WemaSession) {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(session));
  } catch {
    // storage unavailable — the flow still works, it just won't survive a reload
  }
}

export function clearWemaSession() {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {
    // ignore
  }
}

export const maskAccountNumber = (value: string) =>
  value.length >= 4 ? `•••• ${value.slice(-4)}` : value;
