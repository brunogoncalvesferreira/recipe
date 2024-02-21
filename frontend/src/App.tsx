import "./App.css";
import { FormEvent, useEffect, useRef, useState } from "react";
import * as api from "./api";
import { Recipe } from "./types";
import RecipeCard from "./components/recipe-card";
import RecipeModal from "./components/modal";
import { AiOutlineSearch } from "react-icons/ai";

type Tabs = "search" | "favorites";

const App = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const pageNumber = useRef(1);

  const [selectedTab, setSelectedTab] = useState<Tabs>("search");
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);

  /**
   * Erro 8 o useState está digitado errado
   * const [selectedRecipe, setSelectedRecipe] = (useState < Recipe) | (undefined > undefined);
   */
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | undefined>(
    undefined
  );

  const handleViewMoreClick = async () => {
    try {
      const nextPage = pageNumber.current + 1;
      const nextRecipes = await api.searchRecipes(searchTerm, nextPage);
      setRecipes((prevRecipes) => [...prevRecipes, ...nextRecipes.results]);

      pageNumber.current = nextPage;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearchSubmit = async (event: FormEvent) => {
    event.preventDefault();

    try {
      /**
       * Erro 4 falta adicionar p fetch
       * Erro 5 na url recipes deve ser recipe
       * * Erro 6 em setRecipes(data) deve ser setRecipes(data.results)
       * const response = await (`http://localhost:5000/api/recipes/search?searchTerm=${searchTerm}`)
        if(!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json()
      setRecipes(data)
       */

      const response = await api.searchRecipes(searchTerm, 1);
      setRecipes(response.results);
      pageNumber.current = 1;
    } catch (error) {
      console.log(error);
    }
  };

  const addfavoriteRecipe = async (recipe: Recipe) => {
    try {
      await api.addFavoriteRecipe(recipe);
      setFavoriteRecipes([...favoriteRecipes, recipe]);
    } catch (error) {
      console.log(error);
    }
  };

  const removeFavoriteRecipe = async (recipe: Recipe) => {
    try {
      await api.removeFavoriteRecipe(recipe);
      const updatedRecipes = favoriteRecipes.filter(
        (favRecipe) => favRecipe.id !== recipe.id 
      );
      setFavoriteRecipes(updatedRecipes);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const fetchFavoriteRecipes = async () => {
      try {
        const favouriteRecipes = await api.getFavouriteRecipes();
        setFavoriteRecipes(favouriteRecipes.results);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFavoriteRecipes();
  }, []);

  return (
    <div className="app-container">
      <div className="header">
        <img
          src="https://images.unsplash.com/reserve/NFuTknHQTsOc0uHAA4E4_4968226460_33fb941a16_o.jpg?q=80&w=2074&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Hero"
        />
        <div className="title">My Recipe App</div>
      </div>
      <div className="tabs">
        <h1
          className={selectedTab === "search" ? "tab-active" : ""}
          onClick={() => setSelectedTab("search")}
        >
          Recipe Search
        </h1>
        <h1
          className={selectedTab === "favorites" ? "tab-active" : ""}
          onClick={() => setSelectedTab("favorites")}
        >
          Favorites
        </h1>
      </div>

      {selectedTab === "search" && (
        <div>
          <form onSubmit={handleSearchSubmit}>
            <input
              type="text"
              required
              onChange={(e) => setSearchTerm(e.target.value)}
              value={searchTerm}
            />
            <button type="submit">
              <AiOutlineSearch size={40} />
            </button>
          </form>
          <div className="recipe-grid">
            {recipes.map((recipe) => {
              const isFavorite = favoriteRecipes.some(
                (favRecipe) => favRecipe.id === recipe.id
              );
              return (
                <RecipeCard
                  key={recipe.id}
                  recipe={recipe}
                  onClick={() => setSelectedRecipe(recipe)}
                  onFavoriteButtonClick={
                    isFavorite ? removeFavoriteRecipe : addfavoriteRecipe
                  }
                  isFavorite={isFavorite}
                />
              );
            })}
          </div>
          <button className="view-more" onClick={handleViewMoreClick}>
            View More
          </button>
        </div>
      )}

      {selectedTab === "favorites" && (
        <div>
          {favoriteRecipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              onClick={() => setSelectedRecipe(recipe)}
              onFavoriteButtonClick={removeFavoriteRecipe}
              isFavorite={true}
            />
          ))}
        </div>
      )}

      {selectedRecipe ? (
        <RecipeModal
          recipeId={selectedRecipe.id.toString()}
          onClose={() => setSelectedRecipe(undefined)}
        />
      ) : null}
    </div>
  );
};

export default App;
