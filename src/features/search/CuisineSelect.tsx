import { useSearch } from "../../context/SearchContext";

export default function CuisineSelect() {
  const { cuisines, cuisine, setCuisine } = useSearch();
  return (
    <select
      value={cuisine}
      onChange={(e) => setCuisine(e.target.value)}
      className="rounded-full border border-stone-300 dark:border-stone-700 bg-white dark:bg-stone-900 px-3 py-2 text-sm"
      aria-label="Filter by cuisine"
    >
      <option value="">All cuisines</option>
      {cuisines.map((c) => (
        <option key={c} value={c}>{c}</option>
      ))}
    </select>
  );
}
