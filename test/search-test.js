import { expect } from "chai";
import { findRecipeIngredients } from "../src/recipes";
import { search } from "../src/search";
import { mockIngredients, mockRecipeDataset } from "./data/mockData";

describe("Search", () => {
  it("Will return an array", () => {
    const searchResult = search("Pasta", mockRecipeDataset, mockIngredients);
    expect(Array.isArray(searchResult)).to.equal(true);
  });

  it("Will return some recipes that have matching ingredients or name 'co' (known to exist in database)", () => {
    const searchQuery = "co";
    const searchResult = search(
      searchQuery,
      mockRecipeDataset,
      mockIngredients
    );
    const sanitizedQuery = searchQuery.toLowerCase();

    let searchPassCount = 0;
    for (const result of searchResult) {
      if (
        result.name.toLowerCase().includes(sanitizedQuery) ||
        findRecipeIngredients(result, mockIngredients).find((ingredient) =>
          ingredient.toLowerCase().includes(sanitizedQuery)
        )
      ) {
        searchPassCount++;
      }
    }

    expect(searchResult.length).to.not.equal(0);
    expect(searchPassCount).to.equal(searchResult.length);
  });

  it("Will return some recipes that have matching ingredients or name 'wing' (known to exist in database)", () => {
    const searchQuery = "wing";
    const searchResult = search(
      searchQuery,
      mockRecipeDataset,
      mockIngredients
    );
    const sanitizedQuery = searchQuery.toLowerCase();

    let searchPassCount = 0;
    for (const result of searchResult) {
      if (
        result.name.toLowerCase().includes(sanitizedQuery) ||
        findRecipeIngredients(result, mockIngredients).find((ingredient) =>
          ingredient.toLowerCase().includes(sanitizedQuery)
        )
      ) {
        searchPassCount++;
      }
    }

    expect(searchResult.length).to.not.equal(0);
    expect(searchPassCount).to.equal(searchResult.length);
  });

  it("Will return an empty array 'space monkeys' (does not exist)", () => {
    const searchQuery = "space monkeys";
    const searchResult = search(
      searchQuery,
      mockRecipeDataset,
      mockIngredients
    );
    expect(searchResult.length).to.equal(0);
  });
});
