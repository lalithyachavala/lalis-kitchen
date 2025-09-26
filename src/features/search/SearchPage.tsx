import { FormEvent, useState } from "react";
import { motion } from "framer-motion";
import { useSearch } from "../../context/SearchContext";
import CuisineSelect from "./CuisineSelect";
import VegOnlyToggle from "./VegOnlyToggle";
import TimeFilter from "./TimeFilter";
import ResultsGrid from "./ResultsGrid";
import heroImg from "../../assets/hero.png";
import sectionBg from "../../assets/section-bg.png";

export default function SearchPage() {
  const { search, setIngredient, ingredient } = useSearch();
  const [local, setLocal] = useState(ingredient);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const term = local.trim();
    setIngredient(term);
    if (term) search(term);
  };

  return (
    <>
      {/* HERO */}
      <section className="relative">
        <div className="absolute inset-0">
          <img
            src={heroImg}
            alt=""
            className="w-full h-[64svh] sm:h-[72svh] object-cover"
          />
          <div className="absolute inset-0 bg-stone-900/40" />
        </div>

        <div className="container-cozy relative h-[64svh] sm:h-[72svh] flex flex-col justify-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="font-serif text-4xl sm:text-6xl md:text-7xl tracking-tight text-amber-50"
          >
            Come home hungry,<br />leave inspired.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="mt-4 max-w-xl text-amber-100/90"
          >
            Search recipes by what’s already in your kitchen.
          </motion.p>

          <motion.form
            onSubmit={onSubmit}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mt-8"
          >
            <div className="flex flex-wrap items-center gap-3 rounded-full bg-white/95 dark:bg-stone-900/90 p-2 ring-1 ring-black/10 dark:ring-white/10">
              <input
                value={local}
                onChange={(e) => setLocal(e.target.value)}
                placeholder="Ingredient(s), e.g., egg, tomato"
                className="flex-1 min-w-[220px] bg-transparent outline-none px-4 py-2"
                aria-label="Search by ingredient(s)"
              />
              <CuisineSelect />
              <TimeFilter />
              <VegOnlyToggle />
              <button
                type="submit"
                className="rounded-full px-5 py-2 bg-amber-600 text-white hover:bg-amber-700"
              >
                Search
              </button>
            </div>
          </motion.form>
        </div>
      </section>

      {/* COZY MID-SECTION */}
      <section className="relative">
        <div className="absolute inset-0">
          <img src={sectionBg} alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-amber-50/80 dark:bg-stone-900/70" />
        </div>
        <div className="container-cozy relative py-12 sm:py-16">
          <h2 className="font-serif text-3xl sm:text-5xl text-stone-900 dark:text-amber-50 tracking-tight">
            Find what fits your mood 🍲
          </h2>
          <p className="mt-3 text-stone-700 dark:text-amber-200/80 max-w-2xl">
            Use multiple ingredients(comma-separated), filter by cuisine, go veg-only, and pick a time window.
          </p>
        </div>
      </section>

      {/* RESULTS */}
      <section className="container-cozy py-12">
        <ResultsGrid />
      </section>
    </>
  );
}
