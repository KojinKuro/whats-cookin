//NOTE: Data model and non-dom manipulating logic will live in this file.

import apiCalls from "./apiCalls";
import "./styles.css";
// An example of how you tell webpack to use an image (also need to link to it in the index.html)
import ingredientsData from "./data/ingredients";
import "./images/turing-logo.png";
// Below are examples of how you can import functions from either the recipes or domUpdates files.
import recipeData from "./data/recipes";
import usersData from "./data/users";
import { displayRecipes } from "./domUpdates";
import { findRecipeIngredients } from "./recipes";

// all the favorite recipes should be stored as recipe objects here
export const favoriteRecipes = [];
global.favoriteRecipes = favoriteRecipes;
export const currentUser = getRandomUser(usersData);
global.currentUser = currentUser;

function getRandomUser(user_dataset) {
  return user_dataset[randomNumber(user_dataset.length)];
}

function randomNumber(max) {
  return Math.floor(Math.random() * max);
}
