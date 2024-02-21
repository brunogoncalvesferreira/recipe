// File: RecipeModal.tsx
import { useState, useEffect } from "react";
import { RecipeSummary } from "../types";
import * as api from "../api";

interface Props {
  recipeId: string;
  onClose: () => void;
}

const RecipeModal = ({ recipeId, onClose }: Props) => {
  /**
   * Erro 7 o useState está digitado errado
   * const [recipeSummary, setRecipeSummary] = (useState < RecipeSummary) | (null > null);
   */
  const [recipeSummary, setRecipeSummary] = useState<RecipeSummary>();

  useEffect(() => {
    const fetchRecipeSummary = async () => {
      try {
        const summary = await api.getRecipeSummary(recipeId);
        setRecipeSummary(summary);
        console.log(summary);
      } catch (error) {
        console.error(error);
      }
    };
    fetchRecipeSummary();
  }, [recipeId]);

  if (!recipeSummary) {
    return <></>;
  }

  return (
    <div className="overlay">
      <div className="modal">
        <div className="modal-content">
          <div className="modal-header">
            <h2>{recipeSummary?.title}</h2>
            <span className="close-button" onClick={onClose}>
              &times;
            </span>
          </div>
          <p dangerouslySetInnerHTML={{ __html: recipeSummary.summary }}></p>
        </div>
      </div>
    </div>
  );
};
export default RecipeModal;
