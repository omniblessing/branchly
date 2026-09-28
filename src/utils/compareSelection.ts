const KEY = "pgbc-compare-v1";

export function getCompareSelection(): string[] {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((x) => typeof x === "string") : [];
  } catch {
    return [];
  }
}

function persist(ids: string[]) {
  try {
    localStorage.setItem(KEY, JSON.stringify(ids.slice(0, 4)));
  } catch {
    /* storage unavailable */
  }
}

export function setCompareSelection(ids: string[]): string[] {
  const next = ids.slice(0, 4);
  persist(next);
  return next;
}

export function toggleCompare(id: string): string[] {
  const current = getCompareSelection();
  const next = current.includes(id) ? current.filter((x) => x !== id) : [...current, id];
  persist(next);
  return next;
}