import { Link } from "react-router-dom";
import { useFavorites } from "../../context/FavoritesContext";
import type { MealFull } from "../../lib/api";
import { estimateTimeMinutes } from "../../lib/api";

export default function MealCard({ meal }: { meal: MealFull }) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const fav = isFavorite(meal.idMeal);
  const mins = estimateTimeMinutes(meal);

  return (
    <article className="card group transition hover:shadow-lg">
      <div className="relative aspect-[4/3]">
        <img src={meal.strMealThumb} alt={meal.strMeal} className="w-full h-full object-cover" loading="lazy" />
        <button
          className="absolute top-3 right-3 rounded-full bg-white/90 dark:bg-stone-900/90 px-3 py-1 text-xs ring-1 ring-black/5 dark:ring-white/10"
          onClick={(e) => { e.preventDefault(); toggleFavorite(meal.idMeal); }}
          aria-label={fav ? "Remove from favorites" : "Add to favorites"}
          title={fav ? "Remove favorite" : "Add favorite"}
        >
          {fav ? "♥" : "♡"}
        </button>

        <span
          className="absolute bottom-3 left-3 rounded-full bg-white/90 dark:bg-stone-900/90 px-2 py-1 text-xs ring-1 ring-black/5 dark:ring-white/10"
          title="Estimated from instructions; may not be exact."
        >
          ≈ {mins} min
        </span>
      </div>
      <div className="p-4">
        <h3 className="font-medium">{meal.strMeal}</h3>
        <p className="text-xs text-stone-600 dark:text-amber-200/70 mt-1">
          {meal.strCategory || "—"} · {meal.strArea || "—"}
        </p>
        <Link
          to={`/meal/${meal.idMeal}`}
          className="inline-flex mt-3 text-sm text-amber-700 hover:underline dark:text-amber-300"
        >
          View recipe →
        </Link>
      </div>
    </article>
  );
}
