# NeoCash BNPL Widget — Integration Review & Fix Plan

**Status:** implementation in progress on `Abdul-Azeez`.  
**Date:** 18 August 2026  
**Package:** `@neocash/bnpl-widget@1.0.0`  
**Official docs (npm README):** embed as a **checkout modal**. Call `init()` on a pay-button click. The widget owns plan selection, BVN + selfie liveness, credit decisioning, and the **Pay Today deposit-account hand-off**. `onApprovalPending(applicationId)` is a signal to persist the id against *your* order — not a signal to tear the widget down.

## Implementation progress

Mark a phase ✅ in this file before starting the next one so a dropped connection can resume cleanly.

- ✅ Phase 0 — Align with NeoCash (host-side assumptions locked; questions ready to send)
- ✅ Phase 1 — Stop fighting the widget lifecycle
- ✅ Phase 2 — Cart contract, keys, eligibility
- ✅ Phase 3 — Amplify / CSS / stacking
- ✅ Phase 4 — Account page and welcome popup
- ✅ Phase 5 — Backend + webhooks (buyer contract; API checklist below)
- ⬜ Phase 6 — Hardening

---

## Verdict

The widget is present in the buyer app, but it is **not integrated the way NeoCash designed it**.

Several of our React/checkout behaviours interrupt the widget while it is still running: we auto-`init` on radio select, `close()` it from `useEffect` cleanup (including React Strict Mode in local `npm run dev`), reset payment method from `onClose`, place the 9jaCart order and clear the cart while the overlay may still need to show the deposit account, and we mix the **npm bundle** with a **CDN `assetPrefix`**. We also open the same checkout widget on the account page with a **fake ₦50,000 cart**.

That combination matches “your development is fighting with the widget and the widget is failing.”

---

## Buyer codebase (what matters for this review)

Vite + React 19 + React Router + Tailwind v4 SPA.

| Area | Role |
|---|---|
| `src/pages/Checkout/CheckoutPage.tsx` | Real checkout. Auto-inits NeoCash when BNPL is selected. Hides “Place Order”. On `onApprovalPending`, calls `handlePlaceOrder`. |
| `src/components/Account/PaymentSection.tsx` | Account → Payment. Opens the same widget with a placeholder cart for “Pay Small Small setup”. |
| `src/lib/bnplWidget.ts` | Theme, eligibility constants, fake account cart, localStorage “setup submitted”. |
| `src/lib/config.ts` | `VITE_NEOCASH_PUBLIC_KEY` + hardcoded `assetPrefix: https://cdn.neocash.ng/widget/v1/`. |
| `src/components/BNPL/BnplWelcomePopup.tsx` | Informational modal after login. Skips `/checkout` only — **not** `/account`. |
| `src/api/order.ts` | Checkout payload can send `paymentMethod: "bnpl"` and `applicationId`. |
| `src/main.tsx` | Wraps the app in `<StrictMode>` (double-mounts effects in development). |
| `package.json` | Widget plus Amplify liveness peers (`aws-amplify`, `@aws-amplify/ui-react-liveness`). Amplify is **never configured or imported in `src/`**. |

This is a **checkout widget**, not a standalone KYC/onboarding SDK. There is no separate “verify now, buy later” API in the public types.

---

## Current integration (as implemented)

### Checkout

1. User fills shipping. BNPL radio is enabled only when shipping looks complete.
2. Selecting **Buy Now, Pay Later** runs `init()` inside a `useEffect` whose only dependency is `selectedPayment`.
3. “Place Order” is hidden for BNPL. The widget is expected to take over immediately.
4. Cart sent to NeoCash:
   - line `price` = unit price in kobo
   - `total` = **merchandise + shipping + flat rate − discount**, in kobo  
   Line items do **not** include shipping/fees, so `sum(items)` often **≠** `cart.total`.
5. `onApprovalPending` stores `applicationId` and immediately runs full 9jaCart checkout (delivery validation + `orderApi.checkout` / guest checkout).
6. Success path can `clearAllItems()`, which unmounts checkout (empty-cart early return) and the effect cleanup calls `handle.close()`.
7. If the API returns `paymentData.authorizationUrl` or `redirectUrl`, the page hard-redirects (typically Paystack) while NeoCash still expects to show its own deposit account.
8. `onClose` / `onError` set payment method back to **Bank/Card**. `handle.close()` **always fires `onClose`** (NeoCash README).

### Account “setup”

Same `init()`, but with `BNPL_ACCOUNT_SETUP_CART` (one fake line, ₦50,000 / 5,000,000 kobo). Success is stored only in `localStorage` (`9ja_bnpl_profile_setup`). Checkout does **not** reuse that application id.

### Keys / assets

`.env` currently uses a **`pk_live_...` key**. NeoCash docs say use `pk_test_...` for all development. Live keys are often origin-locked to production domains, so localhost/staging can fail for reasons that look like “the widget is broken.”

---

## Why this fights the widget

NeoCash’s intended lifecycle:

```
user clicks Pay with BNPL
  → init() once
  → overlay owns the flow (plans, BVN, liveness, deposit)
  → onApprovalPending(applicationId)  // persist against YOUR order
  → widget stays up until customer closes it or deposit UI is done
  → onClose()  // only then tear down host UI
```

What we do today:

```
user ticks a radio
  → init() in useEffect
  → Strict Mode / shipping effect / navigation → handle.close()
  → onClose → jump back to Bank/Card  (host fights overlay)
  → init() again (second session)
  → onApprovalPending → place 9jaCart order + clear cart / Paystack redirect
  → React unmount → handle.close() while deposit UI may still be running
```

Plus a second product misuse: account page creates **real NeoCash sessions** for a fake basket, so their dashboard/webhooks see applications that never match a 9jaCart order.

---

## Findings

### P0 — will break or interrupt the live widget

| ID | Finding | Why it fails |
|---|---|---|
| P0-1 | **`init()` in a React `useEffect`**, cleanup calls `handle.close()`. App is in **Strict Mode**. | Dev double-mount: open → close → `onClose` → payment reset → open again. Sessions die. HMR does the same. |
| P0-2 | **`onClose` always sets payment to Bank/Card.** | Any programmatic `close()` (cleanup, error, Strict Mode) looks like the user cancelled BNPL. Host state fights the overlay. |
| P0-3 | **Place 9jaCart order (and often clear cart / redirect) inside `onApprovalPending`.** | Widget README: persist `applicationId`; widget still owns **deposit-account hand-off**. Clearing cart unmounts checkout → `close()` mid-flow. Paystack redirect races NeoCash’s Pay Today account. |
| P0-4 | **Cart `total` includes shipping/fees; line items do not.** | NeoCash examples set `total` = sum of `price * qty`. Mismatch is a common session-create failure. |
| P0-5 | **Account page uses a fake ₦50k cart.** | Creates real applications with no merchant order. Pollutes underwriting/webhooks. Checkout ignores the saved id. |
| P0-6 | **Live public key in local `.env`.** | Docs: `pk_test_` for development. Live + localhost is a frequent “widget won’t open” cause. |

### P1 — likely “widget UI / liveness failed”

| ID | Finding | Why it fails |
|---|---|---|
| P1-1 | **npm widget + `assetPrefix` CDN.** | `assetPrefix` is for the **lazy Amplify Face Liveness chunk**. npm install should resolve `@aws-amplify/ui-react-liveness` from **our** `node_modules`. Pointing at `https://cdn.neocash.ng/widget/v1/` mixes two distribution modes (bundled ESM vs CDN chunk). |
| P1-2 | **Amplify peers installed, never wired.** | No `Amplify.configure`, no liveness CSS import. Liveness is React-based (`FaceLivenessDetector`). Host is **React 19**; Amplify UI liveness 3.x targets **React 18**. Tailwind v4 `* { border; outline }` and `button { cursor: pointer !important }` can leak into the liveness DOM if it is not isolated. |
| P1-3 | **No BNPL eligibility gate on checkout.** | `BNPL_MIN_ORDER_NAIRA` (~₦43,750) is used in marketing/popup only. Sub-minimum carts still open the widget and fail inside NeoCash. |
| P1-4 | **BNPL welcome modal on `/account`.** | Popup is skipped on checkout only. Account setup + 3s welcome modal = two overlays, shared Escape / `body { overflow: hidden }`. |
| P1-5 | **Sticky header `z-50`, mobile nav `z-[9999]`.** | Widget overlay may sit under chrome. Camera / buttons look “dead.” |

### P2 — correctness / product gaps

| ID | Finding | Notes |
|---|---|---|
| P2-1 | Checkout does not reuse account `applicationId`. | Local “setup submitted” is cosmetic. |
| P2-2 | Guest BNPL allowed with optional phone. | Prefill may omit phone; NeoCash identity usually needs it. |
| P2-3 | Empty-cart early return after `clearAllItems()`. | BNPL success UI can be skipped; widget unmounts. |
| P2-4 | No user-visible widget error (checkout only `console.error`). | Looks like a silent failure. |
| P2-5 | Theme `fontFamily: Inter` but Inter is not loaded in `index.html`. | Cosmetic. |
| P2-6 | No singleton `init` guard. | README allows multiple instances; we can leave orphan overlays. |
| P2-7 | `node_modules/@neocash` was missing in this workspace at review time. | Install before testing. |

---

## Target architecture (after approval)

**One entry point:** checkout, after the user confirms they want BNPL (button click, not radio `useEffect`).

**Host rules:**

1. Do not `init()` from an effect that cleans up with `close()`.
2. `init()` once per attempt. Keep the handle in a ref. Ignore Strict Mode remounts (ref + “already open” guard).
3. `onClose` must **not** change payment method unless the close was a real user dismiss. Never treat `handle.close()` from our cleanup as cancel.
4. `onApprovalPending`: save `applicationId`, create/update the 9jaCart order **without** destroying the overlay and **without** sending the user to Paystack for Pay Today. Confirm with backend + NeoCash whether order create happens at pending vs after deposit webhook.
5. Cart sent to NeoCash: merchandise in kobo only, unless NeoCash explicitly wants shipping as its own line. `total` must equal `sum(price * qty)`.
6. Disable BNPL below `BNPL_MIN_ORDER_NAIRA` (or live `SessionConfig.min_amount_kobo` if we read it).
7. Account page: **do not** open the checkout widget with a dummy cart unless NeoCash provides a dedicated pre-verify mode. Point users to checkout, or wait for an official KYC-only API.
8. Development: `pk_test_`. Production: `pk_live_`. Do not mix.
9. Amplify: follow **either** npm peers **or** script-tag/CDN — not both. Import liveness CSS in a way that does not restyle the rest of the app. Confirm React 19 with NeoCash; pin React 18 for the checkout chunk if they require it.

---

## Phases

Do not start a later phase until the previous one is marked ✅ below. NeoCash email replies can arrive later; Phases 1–2 proceed on the locked assumptions in Phase 0.

### ✅ Phase 0 — Align with NeoCash (no app code)

**Goal:** stop guessing the money/lifecycle contract.

**Completed:** 18 August 2026 (host-side). Questions below are ready to send to integrations@neocash.ng. Phases 1–2 use the locked assumptions until they reply.

Ask integrations@neocash.ng:

1. When exactly does `onApprovalPending` fire relative to Pay Today / `awaiting_deposit` vs `pending_review`?
2. Should 9jaCart create the merchant order **before** deposit, **after** deposit webhook, or both (draft then confirm)?
3. Must `cart.total` equal the sum of line items? May we add shipping as a line?
4. Is a dummy cart for pre-checkout KYC supported? If not, what should Account → Payment do?
5. For Vite + React 19 + npm: should we **omit** `assetPrefix` and use Amplify peers, or load the widget only via script tag / CDN?
6. Which origins are allow-listed on our public keys (`localhost:5173`, staging, `www.9jacart.ng`)?
7. Is React 19 + `@aws-amplify/ui-react-liveness@3.6.x` a supported liveness host?

**Locked assumptions for Phases 1–2** (from `@neocash/bnpl-widget@1.0.0` README + types; override if NeoCash replies otherwise):

1. Call `init()` once on an explicit pay/continue click — never from a React effect that `close()`s on cleanup.
2. `onClose` fires for user dismiss **and** for `handle.close()`. Do not treat programmatic close as “user cancelled BNPL.”
3. `onApprovalPending(applicationId)` means persist the id against the 9jaCart order. The overlay still owns Pay Today / deposit UI, so do not clear the cart, unmount checkout, or redirect to Paystack while the widget is open.
4. `cart.total` must equal `sum(item.price * item.qty)` in **kobo**. Shipping/fees stay on the 9jaCart order, not in the widget cart, until NeoCash says otherwise.
5. Dummy account-page carts are not a supported KYC mode (Phase 4). Do not change that in Phases 1–2.
6. `pk_test_` for `npm run dev`; `pk_live_` only in production builds.
7. `assetPrefix` / Amplify / z-index isolation is Phase 3 — leave CDN prefix as-is until then.

**Exit:** questions documented + assumptions locked so checkout work can start. Written NeoCash replies still outstanding (do not block 1–2).

### ✅ Phase 1 — Stop fighting the widget lifecycle (P0-1, P0-2, P0-3, P2-3, P2-4, P2-6)

**Goal:** checkout only.

**Completed:** 18 August 2026.

- Removed `init()` from the `selectedPayment` `useEffect`.
- BNPL stays a selected method; CTA is **Continue with Pay Small Small**.
- `init()` runs from that click after billing/delivery validation.
- Cleanup: `close()` only on checkout unmount or when the user switches off BNPL, with a programmatic-close flag so `onClose` does not flip the radio.
- `onApprovalPending`: persist `applicationId`, create the 9jaCart order, **do not** clear the cart or follow Paystack while the overlay is open. Success UI waits for widget `onClose`.
- `onError` is shown in the checkout payment card.

**Exit:** selecting BNPL no longer open/close-loops in Strict Mode. One session per click. Overlay stays up through KYC/deposit.

### ✅ Phase 2 — Cart contract, keys, eligibility (P0-4, P0-6, P1-3)

**Completed:** 18 August 2026.

- Widget cart is merchandise lines only; `total` = `sum(price * qty)` in kobo. Shipping stays on the 9jaCart order.
- BNPL radio is disabled below `BNPL_MIN_ORDER_NAIRA` (~₦43,750 merchandise). `init()` is not called for ineligible carts.
- `npm run dev` uses `VITE_NEOCASH_PUBLIC_KEY_TEST` (`pk_test_`). Production builds use `VITE_NEOCASH_PUBLIC_KEY`.
- Kobo conversion is centralized in `nairaToKobo`.

**Exit:** ineligible carts cannot open the widget. Local dev no longer sends the live public key.

### ✅ Phase 3 — Amplify / CSS / stacking (P1-1, P1-2, P1-5)

**Completed:** 18 August 2026.

- npm-only widget path via `initNeoCashBnplWidget` — **no CDN `assetPrefix`**.
- Amplify liveness CSS loaded at bootstrap (`amplifyLivenessSetup.ts`).
- Vite `optimizeDeps` includes widget + Amplify peers.
- Tailwind base/utilities scoped to `#root` so host `*` / `button` rules do not leak into the NeoCash overlay on `body`.

**Exit:** liveness chunk resolves from `node_modules`; host CSS no longer restyles widget controls.

### ✅ Phase 4 — Account page and welcome popup (P0-5, P1-4, P2-1)

**Completed:** 18 August 2026.

- Removed dummy-cart `init()` from Account → Payment; copy points to checkout on eligible orders.
- Legacy `localStorage` setup note labeled device-only with clear action.
- `BnplWelcomePopup` skips `/checkout`, `/account`, and when `isBnplWidgetOpen()`.
- Removed `BNPL_ACCOUNT_SETUP_CART` and `saveBnplProfileSetup`.

**Exit:** account page no longer creates fake NeoCash applications.

### ✅ Phase 5 — Backend + webhooks (buyer contract)

**Completed (buyer app):** 18 August 2026.

- `applicationId` documented on `CheckoutRequest`; sent on BNPL checkout (already wired).
- BNPL orders ignore Paystack `authorizationUrl` / `redirectUrl` (Phase 1).
- Guest BNPL requires phone number (NeoCash identity prefill).
- `CheckoutSuccess` explains pending NeoCash approval for BNPL orders.

**API team checklist** (not in this repo — confirm on `api.9jacart.ng`):

1. Persist `applicationId` on the order when `paymentMethod === "bnpl"`.
2. Do **not** return Paystack URLs for BNPL Pay Today — NeoCash owns deposit.
3. Consume NeoCash webhooks (`approved` / `declined` / additional checks) and update order payment status.
4. Do not mark BNPL orders paid on widget close alone — wait for webhook or deposit confirmation.

**Exit:** buyer sends correct BNPL payload; backend contract documented for API implementation.

### Phase 6 — Hardening (optional)

- Confirm `NeoCashBNPL.version` in production vs `1.0.0`.
- Pin `@neocash/bnpl-widget` (drop `^` if they patch breakingly).
- Telemetry on `onError`.
- QA script: below-min cart, eligible cart, guest, logged-in, mobile camera, Strict Mode, production live key on production origin only.

---

## Suggested implementation order (when approved)

1. Phase 0 questions (can go out immediately — no code).  
2. Phase 1 + 2 on checkout (highest user-visible fix).  
3. Phase 3 if liveness still fails after lifecycle is fixed.  
4. Phase 4 account page.  
5. Phase 5 with backend.

---

## Files changed (Phases 0–5)

| File | Change |
|---|---|
| `NEOCASH_WIDGET_FIX_PLAN.md` | Progress tracker + phase checkmarks |
| `src/pages/Checkout/CheckoutPage.tsx` | Widget lifecycle, cart, eligibility, guest BNPL phone |
| `src/lib/bnplWidget.ts` | Merchandise cart helpers; removed fake account cart |
| `src/lib/neocashInit.ts` | Centralized npm-only widget init |
| `src/lib/bnplOverlayState.ts` | Global widget-open flag for popups |
| `src/lib/amplifyLivenessSetup.ts` | Amplify liveness CSS bootstrap |
| `src/lib/config.ts` | Test/live keys; no CDN assetPrefix |
| `src/main.tsx` | Import Amplify liveness setup |
| `src/index.css` | Scope Tailwind base to `#root` |
| `vite.config.ts` | optimizeDeps for widget + Amplify |
| `src/components/Account/PaymentSection.tsx` | Checkout-only BNPL guidance (no widget) |
| `src/components/BNPL/BnplWelcomePopup.tsx` | Skip account + active widget |
| `src/components/Checkout/CheckoutSuccess.tsx` | BNPL pending-approval copy |
| `src/api/order.ts` | `applicationId` BNPL contract JSDoc |
| `.env.example` / `.env` | Test key for local dev |

**Next:** Phase 6 hardening (optional).

---

## Quick test notes (for after implementation)

1. `npm run dev` (Strict Mode on): click BNPL CTA once → one overlay, no flicker to Bank/Card.  
2. Eligible cart (~₦50k+ merchandise): session creates.  
3. Ineligible cart: CTA disabled, `init` never called.  
4. Complete through liveness on phone; header/nav must not cover camera CTA.  
5. `onApprovalPending`: order id saved; overlay still visible if deposit UI is required.  
6. Account → Payment: no fake NeoCash application.  
7. Production: live key + production origin only.
