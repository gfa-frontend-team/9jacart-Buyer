import type { Cart, PartnerPrefill, ThemeOptions } from "@neocash/bnpl-widget";

/** Shared NeoCash widget theme — matches checkout branding. */
export const BNPL_WIDGET_THEME: ThemeOptions = {
  primary: "#8DEB6E",
  primaryStrong: "#2ac12a",
  primarySoft: "#c8f5b3",
  primaryWash: "#f0fde8",
  ink: "#1E4700",
  surface: "#f7f8fa",
  border: "#e9eaf0",
  fontFamily: '"Inter", system-ui, sans-serif',
};

/**
 * NeoCash SessionConfig limits (see @neocash/bnpl-widget `SessionConfig`).
 * `min_amount_kobo` is the minimum financeable portion after the pay-today deposit.
 */
export const BNPL_MIN_FINANCEABLE_NAIRA = 35_000;
export const BNPL_MIN_PAY_NOW_RATE = 0.2;

/** Minimum cart total (naira) eligible for BNPL: financeable floor ÷ (1 − pay-today rate). */
export const BNPL_MIN_ORDER_NAIRA = Math.ceil(
  BNPL_MIN_FINANCEABLE_NAIRA / (1 - BNPL_MIN_PAY_NOW_RATE)
);

/**
 * Legacy device-only note from an older account-page widget flow (removed in Phase 4).
 * Not NeoCash approval — safe to clear.
 */
const BNPL_SETUP_STORAGE_KEY = "9ja_bnpl_profile_setup";

export interface BnplProfileSetupRecord {
  applicationId: string;
  completedAt: string;
}

export function nairaToKobo(naira: number): number {
  return Math.round(naira * 100);
}

export function isBnplMerchandiseEligible(merchandiseNaira: number): boolean {
  return Number.isFinite(merchandiseNaira) && merchandiseNaira >= BNPL_MIN_ORDER_NAIRA;
}

export function unitPriceNaira(price: number | { current: number }): number {
  return typeof price === "number" ? price : price.current;
}

/**
 * NeoCash cart for checkout. Merchandise only (no shipping/fees/discounts).
 * `total` is always `sum(price * qty)` in kobo.
 */
export function buildNeoCashMerchandiseCart(
  items: Array<{
    name: string;
    quantity: number;
    unitPriceNaira: number;
    imageUrl?: string;
  }>
): Cart {
  const cartItems = items.map((item) => ({
    name: item.name,
    qty: item.quantity,
    price: nairaToKobo(item.unitPriceNaira),
    ...(item.imageUrl ? { imageUrl: item.imageUrl } : {}),
  }));
  const total = cartItems.reduce((sum, line) => sum + line.price * line.qty, 0);
  return { items: cartItems, total, currency: "NGN" };
}

export function buildPartnerPrefill(fields: {
  firstName?: string;
  lastName?: string;
  phone?: string;
  email?: string;
}): PartnerPrefill | undefined {
  const prefill: PartnerPrefill = {};
  if (fields.firstName?.trim()) prefill.firstName = fields.firstName.trim();
  if (fields.lastName?.trim()) prefill.lastName = fields.lastName.trim();
  if (fields.phone?.trim()) prefill.phone = fields.phone.trim();
  if (fields.email?.trim()) prefill.email = fields.email.trim();
  return Object.keys(prefill).length > 0 ? prefill : undefined;
}

export function getBnplProfileSetup(): BnplProfileSetupRecord | null {
  try {
    const raw = localStorage.getItem(BNPL_SETUP_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as BnplProfileSetupRecord;
    if (!parsed.applicationId || !parsed.completedAt) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function clearBnplProfileSetup(): void {
  try {
    localStorage.removeItem(BNPL_SETUP_STORAGE_KEY);
  } catch {
    /* ignore */
  }
}
