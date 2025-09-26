import { useSearch } from "../../context/SearchContext";

export default function VegOnlyToggle() {
  const { vegOnly, setVegOnly } = useSearch();
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input
        type="checkbox"
        className="size-4 accent-emerald-600"
        checked={vegOnly}
        onChange={(e) => setVegOnly(e.target.checked)}
      />
      Veg only
    </label>
  );
}
