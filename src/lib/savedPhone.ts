/**
 * Remembers the phone number a signed-in buyer used at checkout (this device only).
 *
 * The buyer profile usually has no phone (registration doesn't ask for one, and
 * PUT /buyer/profile/edit can't store it), and saved addresses don't carry a phone
 * either — so without this, buyers had to re-type their number on every order.
 */
const STORAGE_PREFIX = "9ja_checkout_phone:";

export function getSavedPhone(userKey: string | undefined | null): string {
  if (!userKey) return "";
  try {
    return localStorage.getItem(STORAGE_PREFIX + userKey) ?? "";
  } catch {
    return "";
  }
}

export function savePhone(userKey: string | undefined | null, phone: string) {
  const clean = phone.trim();
  if (!userKey || !clean) return;
  try {
    localStorage.setItem(STORAGE_PREFIX + userKey, clean);
  } catch {
    // storage unavailable — the buyer will just be asked again next time
  }
}
