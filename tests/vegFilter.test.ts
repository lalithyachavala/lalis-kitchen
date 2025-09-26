import { describe, expect, it } from "vitest";
import { isVegetarian, type MealFull } from "../src/lib/api";

const base: MealFull = {
  idMeal: "1",
  strMeal: "Test",
  strMealThumb: "",
  ingredients: []
};

describe("isVegetarian", () => {
  it("marks veg when only plant ingredients", () => {
    const m: MealFull = { ...base, ingredients: [{ name: "Potato", measure: "" }, { name: "Onion", measure: "" }] };
    expect(isVegetarian(m)).toBe(true);
  });
  it("marks non-veg when meat appears", () => {
    const m: MealFull = { ...base, ingredients: [{ name: "Chicken Breast", measure: "" }] };
    expect(isVegetarian(m)).toBe(false);
  });
});
