# Lali’s Kitchen — Recipe Ideas (React + Vite + Tailwind)

A warm & cozy recipe finder for Taylor (busy professional): search by ingredient using **TheMealDB** API, filter by cuisine, optionally **veg-only**, browse a responsive **grid with infinite scroll**, and view detailed recipes with **print** and **share** actions. Favorites and recent searches are saved locally.
 Features: multi-ingredient search (comma-separated), cuisine + veg-only + time filters (Any/≤30/≤45/≤60/60+)

 > **Images**: Hero/section images are **generated with Gemini AI**.  
> **Hosting**: Built for **Vercel** (also compatible with GitHub Pages).

---

## ✨ Features

- **Multi-ingredient search** (comma-separated, AND logic) – e.g. `mushrooms, garlic`
- **Filters**: Cuisine / Veg-only / Time (Any / ≤30 / ≤45 / ≤60 / 60+)
- **Cards**: responsive grid, lazy images, infinite scroll (hydrate ~12 at a time)
- **Details**: ingredients, instructions, YouTube (if available), Favorite, Share, Print
- **UX**: warm & cozy theme, dark mode (auto), subtle motion

**Heuristics**
- Time is **estimated** from instructions (dataset doesn’t provide time).
- Veg-only uses a simple **denylist** across parsed ingredient names.

## Stack
- React + Vite + TypeScript + js
- Tailwind CSS
- React Router
- Framer Motion (light fades)
- Vitest + Testing Library

- > **Images**: Hero/section images are **generated with Gemini AI**.  
> **Hosting**: Built for **Vercel** (also compatible with GitHub Pages).

src/
  app/ (App shell + routes)
  features/
    search/ (SearchPage, filters, ResultsGrid)
    meal/   (MealCard, MealDetailPage)
  components/ (InlineBanner, Spinner)
  context/ (FavoritesContext, SearchContext)
  hooks/ (useInfiniteScroll)
  lib/ (api.ts, storage.ts)
  providers/ (SmoothScrollProvider.tsx)
  styles/ (index.css)
  assets/ (Gemini AI images: hero.jpg, section-bg.jpg, icons)
tests/ (Vitest)
vercel.json

🙌 Credits
Data: TheMealDB
Images: Gemini AI (generated)
Tooling: React, Vite, Tailwind, React Router, Framer Motion, Vitest

## Run
```bash
npm i
npm run dev



-Lalithya Chavala
