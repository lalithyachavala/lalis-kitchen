import type { RouteObject } from "react-router-dom";
import SearchPage from "../features/search/SearchPage";
import MealDetailPage from "../features/meal/MealDetailPage";

const routes: RouteObject[] = [
  { path: "/", element: <SearchPage /> },
  { path: "/meal/:id", element: <MealDetailPage /> },
];

export default routes;
