import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RecipeContext from '../context/RecipeContext';
import useFetchRecipes from '../hooks/useFetchRecipes';

function RecipeInProgress() {
  const { displayRecipeInProgress, makeRecipeInProgress,
    isDrink } = useContext(RecipeContext);

  const { makeFetch } = useFetchRecipes();
  const { id } = useParams();

  const getApiId = async () => {
    let endpointDetails = '';

    if (isDrink) {
      endpointDetails = `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${id}`;
    } else {
      endpointDetails = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`;
    }
    const recipesResults = await makeFetch(endpointDetails);
    console.log(recipesResults);
    makeRecipeInProgress(recipesResults);
  };

  const handleClickShare = () => {
  };

  const handleFavoriteProgress = () => {
  };

  const handleFinish = () => {
  };

  useEffect(() => {
    getApiId();
    console.log(displayRecipeInProgress);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  return (
    <div className="recipe-in-progress">
      { displayRecipeInProgress && (
        <>
          <h1 data-testid="recipe-title">
            { displayRecipeInProgress.name }
          </h1>
          <img
            src={ displayRecipeInProgress.img }
            alt="recipe"
            data-testid="recipe-photo"
          />
          <button
            data-testid="share-btn"
            onClick={ handleClickShare }
          >
            Compartilhar
          </button>
          <button
            data-testid="favorite-btn"
            onClick={ handleFavoriteProgress }
          >
            Favoritos
          </button>
          <h4
            data-testid="recipe-category"
          >
            { displayRecipeInProgress.category }
          </h4>
          <h3>Ingredientes</h3>
          <fieldset>
            { displayRecipeInProgress.ingredients
              .map((ingredient, index) => (
                <label
                  htmlFor="ingredient"
                  data-testid={ `${index}-ingredient-step` }
                  key={ index }
                >
                  { ingredient }
                  <input
                    type="checkbox"
                    name={ ingredient }
                  />
                </label>))}
          </fieldset>
          <h3>Instruções</h3>
          <div
            className="instructions"
            data-testid="instructions"
          >
            { displayRecipeInProgress.instructions }
          </div>
          <button
            className="finish-recipe-btn"
            type="button"
            data-testid="finish-recipe-btn"
            value="finalizar"
            onClick={ handleFinish }
          >
            Finalizar
          </button>
        </>
      )}
    </div>
  );
}

export default RecipeInProgress;
