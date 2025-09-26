// src/lib/api.ts

// ---------- Types ----------
export type MealLite = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export type MealFull = MealLite & {
  strCategory?: string;
  strArea?: string;
  strInstructions?: string;
  strYoutube?: string;
  strTags?: string | null;
  ingredients: Array<{ name: string; measure: string }>;
};

type FilterResp = { meals: MealLite[] | null };
type LookupResp = { meals: any[] | null };
type ListAreasResp = { meals: Array<{ strArea: string }> | null };

// ---------- Fetch (proxy + fallbacks, timeout) ----------
/**
 * Proxy + fallback bases:
 * - "/mealdb" is proxied by Vite dev server to https://www.themealdb.com (vite.config.ts)
 * - If proxy/network fails, fall back to direct hosts.
 */
const BASES = [
  "/mealdb/api/json/v1/1",                   // dev proxy
  "https://www.themealdb.com/api/json/v1/1", // direct
  "https://themealdb.com/api/json/v1/1",     // no-www
];

/** Fetch with timeout + base fallbacks */
async function fetchJson<T>(path: string, { timeoutMs = 8000 } = {}): Promise<T> {
  let lastErr: unknown = null;

  for (const base of BASES) {
    const controller = new AbortController();
    const t = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const res = await fetch(`${base}${path}`, {
        signal: controller.signal,
        mode: "cors",
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = (await res.json()) as T;
      clearTimeout(t);
      return data;
    } catch (e) {
      lastErr = e;
      clearTimeout(t);
      // try next base
    }
  }
  throw lastErr ?? new Error("Network error");
}

// ---------- Parsing ----------
/** "mushroom, egg, tomato" → ["mushroom","egg","tomato"] */
export function parseIngredientList(input: string): string[] {
  return input
    .split(/[,]+/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Parse up to 20 ingredient/measure fields from TheMealDB object */
export function parseIngredients(obj: any): Array<{ name: string; measure: string }> {
  const list: Array<{ name: string; measure: string }> = [];
  for (let i = 1; i <= 20; i++) {
    const name = (obj[`strIngredient${i}`] || "").toString().trim();
    const measure = (obj[`strMeasure${i}`] || "").toString().trim();
    if (name) list.push({ name, measure });
  }
  return list;
}

// ---------- API wrappers ----------
/** Basic single-ingredient filter */
export async function filterByIngredient(ingredient: string): Promise<MealLite[]> {
  const data = await fetchJson<FilterResp>(`/filter.php?i=${encodeURIComponent(ingredient.trim())}`);
  return data.meals ?? [];
}

/** Try singular/plural + common US/UK synonyms before giving up (internal) */
async function filterByIngredientSmart(term: string): Promise<MealLite[]> {
  const t = term.toLowerCase().trim();
  const candidates = new LinkedSet<string>([t, ...variantPlurality(t), ...(ALIASES[t] ?? [])]);

  for (const c of candidates.values()) {
    try {
      const res = await filterByIngredient(c);
      if (res.length) return res;
    } catch {
      // try next candidate
    }
  }
  return [];
}

/** Multi-ingredient AND logic via intersection (safe: no results[0] indexing) */
export async function filterByIngredients(ingredients: string[]): Promise<MealLite[]> {
  const list = ingredients.map((i) => i.trim()).filter(Boolean);
  if (list.length === 0) return [];
  if (list.length === 1) return filterByIngredientSmart(list[0]);

  const results: MealLite[][] = await Promise.all(
    list.map((i) => filterByIngredientSmart(i).catch(() => [] as MealLite[]))
  );

  // If any ingredient returns 0, intersection is empty
  if (results.some((arr) => arr.length === 0)) return [];

  // Count ids across all result arrays
  const idCounts = new Map<string, number>();
  const dict = new Map<string, MealLite>(); // id -> representative MealLite

  for (const arr of results) {
    for (const m of arr) {
      idCounts.set(m.idMeal, (idCounts.get(m.idMeal) ?? 0) + 1);
      if (!dict.has(m.idMeal)) dict.set(m.idMeal, m);
    }
  }

  // Keep only ids that appear in EVERY list
  const intersection = [...idCounts.entries()]
    .filter(([, count]) => count === results.length)
    .map(([id]) => dict.get(id))
    .filter((m): m is MealLite => Boolean(m));

  return intersection;
}

/** Get full meal details */
export async function lookupMeal(id: string): Promise<MealFull | null> {
  const data = await fetchJson<LookupResp>(`/lookup.php?i=${encodeURIComponent(id)}`);
  if (!data.meals || !data.meals[0]) return null;
  const m = data.meals[0];
  return {
    idMeal: m.idMeal,
    strMeal: m.strMeal,
    strMealThumb: m.strMealThumb,
    strCategory: m.strCategory || undefined,
    strArea: m.strArea || undefined,
    strInstructions: m.strInstructions || undefined,
    strYoutube: m.strYoutube || undefined,
    strTags: m.strTags ?? null,
    ingredients: parseIngredients(m),
  };
}

/** List cuisines/areas */
export async function listCuisines(): Promise<string[]> {
  const data = await fetchJson<ListAreasResp>(`/list.php?a=list`);
  return (data.meals ?? []).map((x) => x.strArea).filter(Boolean).sort();
}

// ---------- Filters & heuristics ----------
/** Vegetarian heuristic (denylist of non-veg terms) */
const NON_VEG = [
  "chicken", "beef", "pork", "bacon", "ham", "lamb", "mutton", "veal",
  "turkey", "duck", "sausage", "pepperoni", "salami", "chorizo", "prosciutto",
  "fish", "tuna", "salmon", "anchovy", "sardine", "prawn", "shrimp", "crab", "lobster", "oyster", "clam", "squid", "octopus",
  "gelatin", "gelatine",
];

export function isVegetarian(meal: MealFull): boolean {
  const names = meal.ingredients.map((i) => i.name.toLowerCase());
  return !names.some((n) => NON_VEG.some((block) => n.includes(block)));
}

/** Estimate total minutes from instructions (heuristic; TheMealDB has no time fields) */
export function estimateTimeMinutes(meal: MealFull): number {
  const instr = (meal.strInstructions || "").toLowerCase();
  const tags = (meal.strTags || "").toLowerCase();
  const ingredients = meal.ingredients.length;

  // Explicit time mentions
  const timeRegex = /(\d+)\s*(minutes?|mins?|m|hours?|hrs?|hr|h)/g;
  let match: RegExpExecArray | null;
  let totalExplicit = 0;
  let maxExplicit = 0;
  while ((match = timeRegex.exec(instr)) !== null) {
    const n = parseInt(match[1], 10);
    const unit = match[2];
    const mins = /hour|hr|h/.test(unit) ? n * 60 : n;
    totalExplicit += mins;
    if (mins > maxExplicit) maxExplicit = mins;
  }

  // Long-process hints
  if (/overnight|marinat(e|ed|ing)|slow cooker|crockpot/.test(instr)) {
    return Math.max(maxExplicit, 120);
  }

  // If multiple explicit durations, use sum; else max + small overhead
  let estimate = totalExplicit > 0 ? (totalExplicit > maxExplicit ? totalExplicit : maxExplicit + 10) : 0;

  // If no explicit time, infer from complexity
  if (estimate === 0) {
    const steps = Math.max(1, instr.split(/\n+|\. +/).filter((s) => s.trim().length > 0).length);
    estimate = 10 + ingredients * 2 + steps * 3;
    if (/bake|roast/.test(instr)) estimate += 12;
    if (/simmer|stew/.test(instr)) estimate += 10;
    if (/grill|barbecue|broil/.test(instr)) estimate += 12;
    if (/boil/.test(instr)) estimate += 6;
    if (/fry|saute|sauté/.test(instr)) estimate += 6;
  }

  // Tags like quick/easy
  if (/(^|,)\s*quick\s*(,|$)/.test(tags) || /(^|,)\s*easy\s*(,|$)/.test(tags)) {
    estimate = Math.min(estimate, 25);
  }

  // Clamp to reasonable bounds
  return Math.max(5, Math.min(estimate, 180));
}

export type TimeFilter = "any" | "u30" | "u45" | "u60" | "o60";

export function inTimeFilter(meal: MealFull, tf: TimeFilter): boolean {
  const m = estimateTimeMinutes(meal);
  if (tf === "any") return true;
  if (tf === "u30") return m <= 30;
  if (tf === "u45") return m <= 45;
  if (tf === "u60") return m <= 60;
  return m > 60; // o60
}

// ---------- Helpers (plural/synonym & ordered set) ----------
function variantPlurality(t: string): string[] {
  if (t.endsWith("ies")) return [t.slice(0, -3) + "y"]; // berries -> berry
  if (t.endsWith("es")) return [t.slice(0, -2)];        // tomatoes -> tomato
  if (t.endsWith("s")) return [t.slice(0, -1)];         // mushrooms -> mushroom
  return [t + "s"];                                      // mushroom -> mushrooms
}

/** common US/UK aliases both directions */
const ALIASES: Record<string, string[]> = {
  eggplant: ["aubergine"], aubergine: ["eggplant"],
  cilantro: ["coriander"], coriander: ["cilantro"],
  zucchini: ["courgette"], courgette: ["zucchini"],
  scallion: ["spring onion", "green onion"],
  "green onion": ["spring onion", "scallion"],
  capsicum: ["bell pepper"], "bell pepper": ["capsicum"],
  garbanzo: ["chickpea"], chickpea: ["garbanzo"],
  chili: ["chilli"], chilli: ["chili"],
  yoghurt: ["yogurt"], yogurt: ["yoghurt"],
  prawns: ["shrimp"], shrimp: ["prawns"],
  mince: ["ground beef"], "ground beef": ["mince"],
  mutton: ["lamb"], lamb: ["mutton"],
  mushroom: ["mushrooms"], mushrooms: ["mushroom"],
};

/** Minimal ordered-set helper to avoid duplicates while preserving order */
class LinkedSet<T> {
  private arr: T[] = [];
  private set = new Set<T>();
  constructor(initial?: T[]) { initial?.forEach((x) => this.add(x)); }
  add(x: T) { if (!this.set.has(x)) { this.set.add(x); this.arr.push(x); } }
  values() { return this.arr; }
}
