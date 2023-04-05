import React, { useState, useMemo } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import RecipeContext from '../context/RecipeContext';

function RecipeProvider({ children }) {
  const [recipeName, setRecipe] = useState(null);
  // estado para armazenar o objeto retornado da api
  const [recipeInProgress, setRecipeInProgress] = useState([]);
  // estado para armazenar receita a ser mostrada em progresso
  const [showRecipeInProgress, setShowRecipeInProgress] = useState({
    img: '',
    name: '',
    foodId: '',
    category: '',
    instructions: '',
    ingredients: [],
  });

  const history = useHistory();
  const pathName = history.location.pathname;
  const isDrink = (pathName.includes('/drinks'));

  // Pega os ingredientes do objeto e transforma em array
  const ingredientsArray = (object) => {
    const arrayOutput = [];
    const maxIngredientsDrinks = 15;
    const maxIngredientsMeals = 20;
    const qtdIngredients = isDrink ? maxIngredientsDrinks : maxIngredientsMeals;
    for (let i = 1; i <= qtdIngredients; i += 1) {
      const ingredientName = (object[`strIngredient${i}`]);
      if (ingredientName) {
        arrayOutput.push(ingredientName);
      }
    }
    return arrayOutput;
  };

  // Pega o objeto retornado pela api e gera objeto para renderização
  const makeRecipeInProgress = (rec) => {
    let arrayInputs = [];

    if (rec && isDrink) {
      ({ drinks: arrayInputs } = rec);
    }
    if (rec && !isDrink) {
      ({ meals: arrayInputs } = rec);
    }
    if (arrayInputs) {
      const object = {
        img: isDrink ? arrayInputs[0].strDrinkThumb : arrayInputs[0].strMealThumb,
        name: isDrink ? arrayInputs[0].strDrink : arrayInputs[0].strMeal,
        foodId: isDrink ? arrayInputs[0].idDrink : arrayInputs[0].idMeal,
        category: arrayInputs[0].strCategory,
        instructions: arrayInputs[0].strInstructions,
        ingredients: ingredientsArray(arrayInputs[0]),
      };
      setRecipeInProgress(arrayInputs);
      setShowRecipeInProgress(object);
    }
  };

  // Gravar no localStorage os itens setados
  const setLocalStorage = (chave, object) => {
    localStorage.setItem(chave, JSON.stringify(object));
  };

  // Busca no localStorage os itens setados
  const getLocalStorage = (chave) => {
    const contentLocalStorage = JSON.parse(localStorage.getItem(chave));
    return contentLocalStorage;
  };

  // Adiciona receita feita ao estado
  const addNewDoneRecipe = () => {

  };

  // função para mudar a rota após concluir a receita
  const handleFinishButton = () => {
    addNewDoneRecipe(recipeInProgress[0]);
    history.push('/done-recipes');
  };

  const memo = useMemo(() => ({
    recipeName,
    setRecipe,
    showRecipeInProgress,
    setShowRecipeInProgress,
    recipeInProgress,
    setRecipeInProgress,
    makeRecipeInProgress,
    isDrink,
    setLocalStorage,
    getLocalStorage,
    handleFinishButton,
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }), [recipeName, showRecipeInProgress, recipeInProgress]);

  return (
    <RecipeContext.Provider value={ memo }>
      {children}
    </RecipeContext.Provider>
  );
}

RecipeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default RecipeProvider;
