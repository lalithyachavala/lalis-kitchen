// Favorites
const FAV_KEY = "lk:favorites";
export function getFavorites(): Set<string> {
  try {
    const raw = localStorage.getItem(FAV_KEY);
    return new Set<string>(raw ? JSON.parse(raw) : []);
  } catch { return new Set(); }
}
export function saveFavorites(ids: Set<string>) {
  localStorage.setItem(FAV_KEY, JSON.stringify([...ids]));
}

// Recent searches
const RECENT_KEY = "lk:recent";
export function getRecentSearches(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}
export function pushRecentSearch(term: string) {
  const arr = getRecentSearches().filter(x => x.toLowerCase() !== term.toLowerCase());
  arr.unshift(term);
  localStorage.setItem(RECENT_KEY, JSON.stringify(arr.slice(0, 8)));
}
