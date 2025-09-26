{/*import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../src/app/routes";
import React from "react";
import { FavoritesProvider } from "../src/context/FavoritesContext";
import { SearchProvider } from "../src/context/SearchContext";
// was: import "@testing-library/jest-dom";
import "@testing-library/jest-dom/vitest";


function renderWithProviders(path = "/") {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(
    <FavoritesProvider>
      <SearchProvider>
        <RouterProvider router={router} />
      </SearchProvider>
    </FavoritesProvider>
  );
}

describe("routing", () => {
  it("renders search page", () => {
    renderWithProviders("/");
    expect(screen.getByText(/come home hungry/i)).toBeInTheDocument();
  });

  it("renders meal detail placeholder when navigating", () => {
    renderWithProviders("/meal/52772");
    // shows spinner (loading state)
    expect(screen.getByRole("status", { hidden: true }) || true).toBeTruthy();
  });
}); */}

/// <reference types="vitest" />

import { describe, it, expect, vi } from "vitest";

// Mock API module BEFORE importing routes/components
vi.mock("../src/lib/api", async () => {
  // If you want to keep types/helpers, spread the actual module:
  const actual = await vi.importActual<any>("../src/lib/api");
  return {
    ...actual,
    listCuisines: vi.fn().mockResolvedValue(["American", "Italian"]),
    // Return null to keep the page in "loading" (spinner) state
    lookupMeal: vi.fn().mockResolvedValue(null),
  };
});

import { render, screen } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import routes from "../src/app/routes";
import React from "react";
import { FavoritesProvider } from "../src/context/FavoritesContext";
import { SearchProvider } from "../src/context/SearchContext";

function renderWithProviders(path = "/") {
  const router = createMemoryRouter(routes, { initialEntries: [path] });
  return render(
    <FavoritesProvider>
      <SearchProvider>
        <RouterProvider router={router} />
      </SearchProvider>
    </FavoritesProvider>
  );
}

describe("routing", () => {
  it("renders search page", () => {
    renderWithProviders("/");
    expect(screen.getByText(/come home hungry/i)).toBeInTheDocument();
  });

  it("renders spinner on meal detail initial load", () => {
    renderWithProviders("/meal/52772");
    // Spinner has role="status"
    expect(screen.getByRole("status")).toBeInTheDocument();
  });
});

