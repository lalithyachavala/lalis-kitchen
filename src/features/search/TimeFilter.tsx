import { useSearch } from "../../context/SearchContext";
import type { TimeFilter } from "../../lib/api";

const OPTIONS: { value: TimeFilter; label: string }[] = [
  { value: "any", label: "Any time" },
  { value: "u30", label: "Under 30 min" },
  { value: "u45", label: "Under 45 min" },
  { value: "u60", label: "Under 60 min" },
  { value: "o60", label: "60+ min" },
];

export default function TimeFilter() {
  const { timeFilter, setTimeFilter } = useSearch();
  return (
    <select
      value={timeFilter}
      onChange={(e) => setTimeFilter(e.target.value as TimeFilter)}
      className="rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-sm"
      aria-label="Filter by time"
      title="Estimated from instructions; may not be exact."
    >
      {OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
