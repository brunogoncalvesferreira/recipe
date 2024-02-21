import "dotenv/config";

import express from "express";
import cors from "cors";

import { PrismaClient } from "@prisma/client";

import { getFavoriteRecipesByIds } from "./recipe-api";

import * as RecipeAPI from "./recipe-api";

const app = express();
app.use(cors());
app.use(express.json());

const prismaClient = new PrismaClient();

app.get("/api/recipes/search", async (req, res) => {
  const searchTerm = req.query.searchTerm as string;

  const page = parseInt(req.query.page as string);

  /**
   * Erro 2 recipeAPI sendo chamado com a primeira letra minuscula
   *  const results = await recipeAPI.searchRecipes(searchTerm, page)
   */
  const results = await RecipeAPI.searchRecipes(searchTerm, page);
  return res.json(results);
});

app.get("/api/recipes/:recipeId/summary", async (req, res) => {
  const recipeId = req.params.recipeId;
  const result = await RecipeAPI.getRecipeSummary(recipeId);
  return res.json(result);
});

app.post("/api/recipes/favorite", async (req, res) => {
  const { recipeId } = req.body;

  console.log(recipeId);

  try {
    const favoriteRecipe = await prismaClient.favoriteRecipe.create({
      data: {
        recipeId,
      },
    });

    return res.status(201).json(favoriteRecipe);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Oops, something went wrong." });
  }
});

app.get("/api/recipes/favorite", async (req, res) => {
  try {
    const favoriteRecipes = await prismaClient.favoriteRecipe.findMany();
    console.log(favoriteRecipes);

    const recipeIds = favoriteRecipes.map((recipe) =>
      recipe.recipeId.toString()
    );

    const favorites = await getFavoriteRecipesByIds(recipeIds);
    return res.json(favorites);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Oops, something went wrong." });
  }
});

app.delete("/api/recipes/favorite", async (req, res) => {
  const { recipeId } = req.body.recipeId;
  try {
    await prismaClient.favoriteRecipe.delete({
      where: { 
        recipeId: recipeId,
       },
    });

    res.status(204).send();
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Oops, something went wrong." });
  }
});

app.listen(5000, () => {
  console.log("Server started on port 5000");
});
