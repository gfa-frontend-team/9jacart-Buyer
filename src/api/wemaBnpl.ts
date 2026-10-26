import { apiClient, ApiError } from "./client";

/**
 * Wema Bank BNPL (ALAT) — proxied by the 9jaCart API under /payment/wema-bnpl.
 *
 * Flow (from the backend's Postman collection "WEMA BANK BNPL"):
 *  1. POST /consent-request           → data.consentId, data.accountName (prompt sent to ALAT app)
 *  2. Customer approves in ALAT
 *  3. GET  /consent-status/:consentId → data.consentStatus {id, name}, data.eligibilityId,
 *                                       data.merchantsCustomerReference, data.prequalifiedAmount
 *  4. POST /disbursement-eligibility  → data.disbursementEligibilityId, data.estimatedRepaymentShedules[],
 *                                       data.termsAndConditionsResponse (HTML)
 *  5. POST /disburse { loanEligibilityId: disbursementEligibilityId, isTermsAccepted }
 *                                     → data.isSuccessful, data.message ("Processing Disbursement")
 *  GET /loan-status/:merchantCustomerReference → status              (not documented yet)
 *
 * Envelope: `{ status, error, message, data }`. Errors can arrive with HTTP 200 and
 * `error: true`, so every response goes through `unwrap`.
 */

const BASE = "/payment/wema-bnpl";

export interface WemaConsentRequest {
  accountNumber: string;
  productAmount: number;
  equityAmount: number;
  tenure: number;
  productId: string;
}

export type WemaConsentState = "pending" | "approved" | "declined" | "expired" | "unknown";

export interface WemaConsentStatus {
  state: WemaConsentState;
  /** Raw Wema label, e.g. "Consent Granted" */
  statusName: string | null;
  eligibilityId: string | null;
  merchantCustomerReference: string | null;
  /** Most Wema will lend this customer */
  prequalifiedAmount?: number;
  raw: unknown;
}

export interface WemaRepayment {
  date: string;
  amount: number;
  /** Wema's note, e.g. "Vat + Management fee + Insurance" or "Paid Automatically 1 months later" */
  note: string;
  /** True for the monthly instalments; false for charges due at disbursement */
  isInstalment: boolean;
}

export interface WemaLoanOffer {
  /** `disbursementEligibilityId` — sent to /disburse as `loanEligibilityId` */
  loanEligibilityId: string;
  schedule: WemaRepayment[];
  /** Fees due at disbursement (VAT + management + insurance) */
  upfrontFees: number;
  monthlyRepayment?: number;
  instalmentCount: number;
  totalRepayment: number;
  /** Wema's loan agreement as an HTML document */
  termsHtml: string | null;
  raw: unknown;
}

export interface WemaDisbursement {
  /** Wema queues the payout ("Processing Disbursement"); final state comes from loan-status */
  message: string | null;
  raw: unknown;
}

interface Envelope<T = Record<string, unknown>> {
  status?: number;
  error?: boolean;
  message?: string;
  data?: T;
}

/** Throws on `error: true` even when the HTTP status was 200; returns `data` (or the body). */
function unwrap(raw: unknown): Record<string, unknown> {
  const body = (raw ?? {}) as Envelope;
  if (body.error === true) {
    throw new ApiError(
      typeof body.status === "number" ? body.status : 400,
      body.message || "Wema Bank could not process this request.",
      raw
    );
  }
  const data = body.data;
  return data && typeof data === "object" ? (data as Record<string, unknown>) : (body as Record<string, unknown>);
}

/** Depth-first search for the first matching key (case-insensitive) holding a usable value. */
export function findField(payload: unknown, keys: string[], depth = 0): unknown {
  if (payload === null || typeof payload !== "object" || depth > 6) return undefined;
  const wanted = keys.map((k) => k.toLowerCase());

  if (!Array.isArray(payload)) {
    for (const [k, v] of Object.entries(payload as Record<string, unknown>)) {
      if (wanted.includes(k.toLowerCase()) && v !== null && v !== undefined && v !== "") {
        return v;
      }
    }
  }
  for (const v of Object.values(payload as Record<string, unknown>)) {
    const found = findField(v, keys, depth + 1);
    if (found !== undefined) return found;
  }
  return undefined;
}

const asString = (v: unknown): string | null =>
  typeof v === "string" && v.trim() ? v.trim() : typeof v === "number" ? String(v) : null;

const asNumber = (v: unknown): number | undefined => {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const n = parseFloat(v.replace(/[^0-9.-]/g, ""));
    if (Number.isFinite(n)) return n;
  }
  return undefined;
};

const REFERENCE_KEYS = ["merchantsCustomerReference", "merchantCustomerReference", "customerReference"];

/** Known Wema messages → plain sentences for buyers. */
const FRIENDLY_MESSAGES: Array<[RegExp, string]> = [
  [/pending disbursement/i, "You already have a Wema loan being processed. Please wait for it to complete before starting a new one."],
  [/eligibility has expired|expired/i, "Your loan offer has expired. Please start again to get a fresh offer."],
  [/consent .* not found|not found/i, "We couldn't find this request with Wema. Please start again."],
];

/** Strip the backend's "Wema BNPL Error (400): " prefix so buyers see a plain sentence. */
export function cleanWemaError(error: unknown): string {
  if (error instanceof ApiError && error.status === 0) {
    return "We couldn't reach Wema Bank. Check your internet connection and try again.";
  }
  if (error instanceof ApiError && error.status >= 500) {
    return "Wema Bank is not responding right now. Please try again in a moment.";
  }
  const raw =
    error instanceof ApiError || error instanceof Error ? error.message : String(error ?? "");
  const cleaned = raw.replace(/^\s*Wema BNPL Error\s*\(\d+\)\s*:\s*/i, "").trim();
  for (const [pattern, friendly] of FRIENDLY_MESSAGES) {
    if (pattern.test(cleaned)) return friendly;
  }
  return cleaned || "Something went wrong with Wema Bank. Please try again.";
}

/** True when Wema says the offer/consent is no longer valid and the flow must restart. */
export const isWemaExpiredError = (error: unknown) =>
  /expired|not found/i.test(error instanceof Error ? error.message : String(error ?? ""));

/**
 * Wema consent status ids (confirmed by backend):
 *   0 Pending (waiting for approval on ALAT) · 1 Approved · 2 Consent Granted
 *   3 Declined / Rejected · 4 Expired
 * Only 2 (Consent Granted) lets the flow continue to the eligibility step.
 */
const CONSENT_STATUS_BY_ID: Record<number, WemaConsentState> = {
  0: "pending",
  1: "pending", // approved in ALAT but not yet granted — keep polling
  2: "approved",
  3: "declined",
  4: "expired",
};

function readConsentState(data: Record<string, unknown>): { state: WemaConsentState; name: string | null } {
  const consentStatus = data.consentStatus as { id?: unknown; name?: unknown } | undefined;
  const name = asString(consentStatus?.name);
  const id = asNumber(consentStatus?.id);

  if (id !== undefined && id in CONSENT_STATUS_BY_ID) {
    return { state: CONSENT_STATUS_BY_ID[id], name };
  }
  // Fallback on the label if an unknown id ever appears
  if (name) {
    if (/declin|reject|denied|revok|cancel/i.test(name)) return { state: "declined", name };
    if (/expir|timeout|timed out/i.test(name)) return { state: "expired", name };
    if (/granted/i.test(name)) return { state: "approved", name };
  }
  return { state: "pending", name };
}

/**
 * While the customer hasn't approved yet, consent-status may fail with
 * HTTP 400 "Consent is not approved or is expired". That alone doesn't mean
 * expired, so it's treated as still pending; the flow's timeout ends polling.
 */
const isNotYetApprovedError = (error: unknown) =>
  error instanceof ApiError &&
  error.status === 400 &&
  /not approved or is expired/i.test(error.message);

export const wemaBnplApi = {
  /** Step 1: sends an approval prompt to the customer's ALAT app. */
  requestConsent: async (
    body: WemaConsentRequest
  ): Promise<{ consentId: string; accountName: string | null; raw: unknown }> => {
    const raw = await apiClient.post<unknown>(`${BASE}/consent-request`, body, undefined, true);
    const data = unwrap(raw);
    const consentId = asString(data.consentId);
    if (!consentId) {
      throw new Error("Wema Bank did not return a consent reference. Please try again.");
    }
    return { consentId, accountName: asString(data.accountName), raw };
  },

  /** Step 3: poll until the customer approves in ALAT; approval yields eligibilityId. */
  getConsentStatus: async (consentId: string): Promise<WemaConsentStatus> => {
    let raw: unknown;
    let data: Record<string, unknown>;
    try {
      raw = await apiClient.get<unknown>(
        `${BASE}/consent-status/${encodeURIComponent(consentId)}`,
        undefined,
        true
      );
      data = unwrap(raw);
    } catch (error) {
      if (isNotYetApprovedError(error)) {
        return {
          state: "pending",
          statusName: null,
          eligibilityId: null,
          merchantCustomerReference: null,
          raw: error instanceof ApiError ? error.data : undefined,
        };
      }
      throw error;
    }
    const { state, name } = readConsentState(data);
    return {
      state,
      statusName: name,
      eligibilityId: state === "approved" ? asString(data.eligibilityId) : null,
      merchantCustomerReference: asString(findField(data, REFERENCE_KEYS)),
      prequalifiedAmount: asNumber(data.prequalifiedAmount),
      raw,
    };
  },

  /** Step 4: checks the loan can be disbursed; returns loanEligibilityId + offer. */
  checkEligibility: async (body: {
    consentId: string;
    productId: string;
    incomeEligibilityId: string;
  }): Promise<WemaLoanOffer> => {
    const raw = await apiClient.post<unknown>(
      `${BASE}/disbursement-eligibility`,
      body,
      undefined,
      true
    );
    const data = unwrap(raw);
    const loanEligibilityId =
      asString(data.disbursementEligibilityId) ??
      asString(findField(data, ["disbursementEligibilityId", "loanEligibilityId"]));
    if (!loanEligibilityId) {
      throw new Error("You're not eligible for this loan right now.");
    }

    // Field is spelt "Shedules" by the API; accept the corrected spelling too
    const rawSchedule = (data.estimatedRepaymentShedules ?? data.estimatedRepaymentSchedules) as unknown;
    const schedule: WemaRepayment[] = Array.isArray(rawSchedule)
      ? rawSchedule
          .map((entry) => {
            const e = (entry ?? {}) as Record<string, unknown>;
            const note = asString(e.note) ?? "";
            return {
              date: asString(e.repaymentDate) ?? "",
              amount: asNumber(e.repaymentAmount) ?? 0,
              note,
              isInstalment: /later|instal|month/i.test(note),
            };
          })
          .filter((entry) => entry.amount > 0)
      : [];
    const instalments = schedule.filter((entry) => entry.isInstalment);

    return {
      loanEligibilityId,
      schedule,
      upfrontFees: schedule.filter((entry) => !entry.isInstalment).reduce((sum, e) => sum + e.amount, 0),
      monthlyRepayment: instalments[0]?.amount,
      instalmentCount: instalments.length,
      totalRepayment: Math.round(schedule.reduce((sum, e) => sum + e.amount, 0) * 100) / 100,
      termsHtml: asString(data.termsAndConditionsResponse),
      raw,
    };
  },

  /** Step 5: disburses the loan once the customer accepts the terms. */
  disburse: async (loanEligibilityId: string): Promise<WemaDisbursement> => {
    const raw = await apiClient.post<unknown>(
      `${BASE}/disburse`,
      { loanEligibilityId, isTermsAccepted: true },
      undefined,
      true
    );
    const data = unwrap(raw);
    if (data.isSuccessful === false) {
      throw new ApiError(400, asString(data.message) ?? "Wema Bank could not disburse this loan.", raw);
    }
    return { message: asString(data.message), raw };
  },

  getLoanStatus: async (merchantCustomerReference: string): Promise<Record<string, unknown>> =>
    unwrap(
      await apiClient.get<unknown>(
        `${BASE}/loan-status/${encodeURIComponent(merchantCustomerReference)}`,
        undefined,
        true
      )
    ),
};
