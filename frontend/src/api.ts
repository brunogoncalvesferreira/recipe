/**
 * Erro 3 usar o export nesta função
 * const searchRecipes = async (searchTerm: string, page: number) => {
  const baseURL = new URL("http://localhost:5000/api/recipes/search");

  baseURL.searchParams.append("searchTerm", searchTerm);

  baseURL.searchParams.append("page", page.toString());

  const response = await fetch(baseURL.toString());

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  return response.json();
}
 */

import { Recipe } from "./types";

export const searchRecipes = async (searchTerm: string, page: number) => {
  const baseURL = new URL("http://localhost:5000/api/recipes/search");
  baseURL.searchParams.append("searchTerm", searchTerm);
  baseURL.searchParams.append("page", page.toString());

  const response = await fetch(baseURL.toString());
  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }
  return response.json();
};

export const getRecipeSummary = async (recipeId: string) => {
  const url = new URL(`http://localhost:5000/api/recipes/${recipeId}/summary`);
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`HTTP Error: ${response.status}`);
  }

  return response.json();
};

export const getFavouriteRecipes = async () => {
  /**
   * Erro 9 favourite, o correto é favorite
   * const url = new URL("http://localhost:5000/api/recipes/favourite");
   */
  const url = new URL("http://localhost:5000/api/recipes/favorite");
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  return response.json();
};

/**
 * Erro 10 no argumento da função recipe deve receber a tipagem Recipe é o method vazio tem que ser passado POST
 * Na rota o favourite e favorite
 * export const addFavoriteRecipe = async (recipe) => {
  const body = {
    recipeId: recipe.id,
  };
  const response = await fetch("http://localhost:5000/api/recipes/favourite", {
    method: "",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Failed to save favorite");
  }
};
 */
export const addFavoriteRecipe = async (recipe: Recipe) => {
  const body = {
    recipeId: recipe.id,
  };
  const response = await fetch("http://localhost:5000/api/recipes/favorite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    throw new Error("Failed to save favorite");
  }
};

export const removeFavoriteRecipe = async (recipe: Recipe) => {
  const body = {
    recipeID: recipe.id,
  };

  const response = await fetch("http://localhost:5000/api/recipes/favorite", {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body.recipeID),
  });
  if (!response.ok) {
    throw new Error("Failed to remove favorite");
  }
};
