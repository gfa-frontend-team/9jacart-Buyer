/** Buyer's recent search terms (this device only). */
const STORAGE_KEY = "9ja_recent_searches";
const MAX_ITEMS = 8;

export function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const parsed = raw ? (JSON.parse(raw) as unknown) : [];
    return Array.isArray(parsed) ? parsed.filter((s): s is string => typeof s === "string") : [];
  } catch {
    return [];
  }
}

export function addRecentSearch(term: string) {
  const clean = term.trim();
  if (!clean) return;
  try {
    const next = [
      clean,
      ...getRecentSearches().filter((s) => s.toLowerCase() !== clean.toLowerCase()),
    ].slice(0, MAX_ITEMS);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // storage unavailable — recent searches are a convenience only
  }
}

export function clearRecentSearches() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
