import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./styles/index.css";
import App from "./app/App";
import routes from "./app/routes";
import { FavoritesProvider } from "./context/FavoritesContext";
import { SearchProvider } from "./context/SearchContext";
import SmoothScrollProvider from "./providers/SmoothScrollProvider"; // +++


const router = createBrowserRouter(routes);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <FavoritesProvider>
      <SearchProvider>
        <SmoothScrollProvider> {/* +++ */}
          <App />
          <RouterProvider router={router} />
        </SmoothScrollProvider>
      </SearchProvider>
    </FavoritesProvider>
  </React.StrictMode>
);
