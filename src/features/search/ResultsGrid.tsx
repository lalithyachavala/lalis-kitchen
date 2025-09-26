import { useMemo } from "react";
import { useSearch } from "../../context/SearchContext";
import { isVegetarian, inTimeFilter } from "../../lib/api";
import MealCard from "../meal/MealCard";
import Spinner from "../../components/Spinner";
import InlineBanner from "../../components/InlineBanner";
import { useInfiniteScroll } from "../../hooks/useInfiniteScroll";

export default function ResultsGrid() {
  const {
    results, hydrated, visibleCount, loadMore,
    loading, error, cuisine, vegOnly, ingredient, timeFilter
  } = useSearch();

  const items = useMemo(() => {
    const ids = results.slice(0, visibleCount).map(r => r.idMeal);
    let list = ids.map(id => hydrated[id]).filter(Boolean) as any[];
    if (cuisine) list = list.filter(m => (m.strArea || "") === cuisine);
    if (vegOnly) list = list.filter(m => isVegetarian(m));
    if (timeFilter !== "any") list = list.filter(m => inTimeFilter(m, timeFilter));
    return list;
  }, [results, hydrated, visibleCount, cuisine, vegOnly, timeFilter]);

  const sentinelRef = useInfiniteScroll(() => {
    if (!loading && items.length < results.length) loadMore();
  });

  if (error && results.length === 0) {
    const kind = error.startsWith("No meals") ? "info" : "error";
    return (
      <div className="mt-6">
        <InlineBanner kind={kind as any} message={error} />
      </div>
    );
  }

  return (
    <>
      {ingredient && (
        <p className="text-sm text-stone-600 dark:text-amber-200/70 mt-2">
          Showing results for <span className="font-medium">“{ingredient}”</span>
          {cuisine ? ` · ${cuisine}` : ""}{vegOnly ? " · veg-only" : ""}
          {timeFilter !== "any" ? ` · time: ${timeFilter}` : ""}
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {items.map(m => <MealCard key={m.idMeal} meal={m} />)}
      </div>

      {loading && <Spinner />}

      <div ref={sentinelRef} className="h-8" />
    </>
  );
}
