import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import {
  MealLite, MealFull,
  filterByIngredients, listCuisines, lookupMeal,
  isVegetarian, inTimeFilter, parseIngredientList,
  TimeFilter
} from "../lib/api";
import { pushRecentSearch } from "../lib/storage";

type Ctx = {
  ingredient: string;
  setIngredient: (s: string) => void;
  cuisine: string;
  setCuisine: (s: string) => void;
  vegOnly: boolean;
  setVegOnly: (b: boolean) => void;
  timeFilter: TimeFilter;
  setTimeFilter: (t: TimeFilter) => void;

  cuisines: string[];
  loading: boolean;
  error: string | null;

  results: MealLite[];
  hydrated: Record<string, MealFull>;
  visibleCount: number;
  loadMore: () => void;

  search: (term: string) => Promise<void>;
};

const SearchCtx = createContext<Ctx | null>(null);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [ingredient, setIngredient] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [vegOnly, setVegOnly] = useState(false);
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("any");

  const [cuisines, setCuisines] = useState<string[]>([]);
  const [results, setResults] = useState<MealLite[]>([]);
  const [hydrated, setHydrated] = useState<Record<string, MealFull>>({});
  const [visibleCount, setVisibleCount] = useState(12);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    listCuisines().then(setCuisines).catch(() => {});
  }, []);

  const hydrateSlice = useCallback(async (from: number, to: number) => {
    const slice = results.slice(from, to);
    const ids = slice.map(m => m.idMeal).filter(id => !hydrated[id]);
    if (!ids.length) return;
    try {
      const fulls = await Promise.all(ids.map(id => lookupMeal(id)));
      setHydrated(prev => {
        const next = { ...prev };
        fulls.forEach(m => { if (m) next[m.idMeal] = m; });
        return next;
      });
    } catch {}
  }, [results, hydrated]);

  const search = useCallback(async (term: string) => {
    const ingredients = parseIngredientList(term);
    const pretty = ingredients.join(", ");
    setIngredient(pretty);
    if (!ingredients.length) return;

    setLoading(true);
    setError(null);
    try {
      const list = await filterByIngredients(ingredients);
      setResults(list);
      setHydrated({});
      setVisibleCount(12);
      await hydrateSlice(0, Math.min(12, list.length));
      pushRecentSearch(pretty);
      if (list.length === 0) setError(`No meals found for "${pretty}".`);
    } catch {
      setError("Couldn’t reach TheMealDB. Check your connection and try again.");
      setResults([]); setHydrated({});
    } finally {
      setLoading(false);
    }
  }, [hydrateSlice]);

  const loadMore = useCallback(async () => {
    const next = Math.min(results.length, visibleCount + 12);
    await hydrateSlice(visibleCount, next);
    setVisibleCount(next);
  }, [results.length, visibleCount, hydrateSlice]);

  const value = useMemo<Ctx>(() => ({
    ingredient, setIngredient,
    cuisine, setCuisine,
    vegOnly, setVegOnly,
    timeFilter, setTimeFilter,
    cuisines, loading, error,
    results, hydrated, visibleCount, loadMore,
    search
  }), [ingredient, cuisine, vegOnly, timeFilter, cuisines, loading, error, results, hydrated, visibleCount, loadMore, search]);

  return <SearchCtx.Provider value={value}>{children}</SearchCtx.Provider>;
};

export function useSearch() {
  const ctx = useContext(SearchCtx);
  if (!ctx) throw new Error("useSearch must be used within SearchProvider");
  return ctx;
}
