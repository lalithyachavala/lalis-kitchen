import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { lookupMeal, type MealFull, estimateTimeMinutes } from "../../lib/api";
import { useFavorites } from "../../context/FavoritesContext";
import InlineBanner from "../../components/InlineBanner";
import Spinner from "../../components/Spinner";

export default function MealDetailPage() {
  const { id } = useParams();
  const [meal, setMeal] = useState<MealFull | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    (async () => {
      try {
        if (id) setMeal(await lookupMeal(id));
      } catch {
        setError("Couldn’t load this recipe.");
      }
    })();
  }, [id]);

  if (error) {
    return (
      <div className="container-cozy py-12">
        <InlineBanner kind="error" message={error} />
      </div>
    );
  }

  if (!meal) {
    return (
      <div className="container-cozy py-12">
        <Spinner />
      </div>
    );
  }

  const fav = isFavorite(meal.idMeal);
  const mins = estimateTimeMinutes(meal);

  const onShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      alert("Link copied!");
    } catch {
      alert("Copy failed. You can copy the URL from the address bar.");
    }
  };

  const onPrint = () => window.print();

  return (
    <div className="container-cozy py-12 print:py-0">
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7">
          <div className="relative">
            <img
              src={meal.strMealThumb}
              alt={meal.strMeal}
              className="w-full rounded-2xl ring-1 ring-black/5 dark:ring-white/10 print:rounded-none print:ring-0"
            />
            <span
              className="absolute bottom-3 left-3 rounded-full bg-white/90 dark:bg-stone-900/90 px-2 py-1 text-xs ring-1 ring-black/5 dark:ring-white/10 no-print"
              title="Estimated from instructions; may not be exact."
            >
              ≈ {mins} min
            </span>
          </div>

          <div className="flex gap-3 mt-4 no-print">
            <button
              onClick={() => toggleFavorite(meal.idMeal)}
              className="rounded-full px-4 py-2 ring-1 ring-black/10 dark:ring-white/10 bg-white/90 dark:bg-stone-800/80"
            >
              {fav ? "♥ Favorited" : "♡ Favorite"}
            </button>
            <button
              onClick={onShare}
              className="rounded-full px-4 py-2 bg-amber-600 text-white hover:bg-amber-700"
            >
              Share
            </button>
            <button
              onClick={onPrint}
              className="rounded-full px-4 py-2 ring-1 ring-black/10 dark:ring-white/10"
            >
              Print
            </button>
          </div>
        </div>

        <div className="lg:col-span-5">
          <h1 className="font-serif text-3xl">{meal.strMeal}</h1>
          <p className="text-sm text-stone-600 dark:text-amber-200/70 mt-1">
            {meal.strCategory || "—"} · {meal.strArea || "—"}
          </p>
          <p
            className="text-sm text-stone-700 dark:text-amber-200 mt-1"
            title="Estimated from instructions; may not be exact."
          >
            Estimated time: ≈ {mins} min
          </p>

          <h2 className="font-medium mt-6">Ingredients</h2>
          <ul className="mt-2 space-y-1">
            {meal.ingredients.map((i, idx) => (
              <li key={idx} className="text-sm">
                {i.name} {i.measure ? `– ${i.measure}` : ""}
              </li>
            ))}
          </ul>

          <h2 className="font-medium mt-6">Instructions</h2>
          <p className="mt-2 whitespace-pre-line text-sm leading-6">
            {meal.strInstructions || "—"}
          </p>

          {meal.strYoutube && (
            <a
              href={meal.strYoutube}
              target="_blank"
              rel="noreferrer"
              className="inline-flex mt-4 text-amber-700 hover:underline dark:text-amber-300 no-print"
            >
              Watch on YouTube →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
