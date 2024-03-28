// Your fetch requests will live here!

// global.usersAPIData = usersAPIData;
// global.recipesAPIData = recipesAPIData;
// global.ingredientsAPIData = ingredientsAPIData;

import { init } from "./domUpdates";

export let usersAPIData;
export let recipesAPIData;
export let ingredientsAPIData;

function fetchUser() {
  return fetch("https://what-s-cookin-starter-kit.herokuapp.com/api/v1/users")
    .then((r) => r.json())
    .then((data) => data.users)
    .catch((error) => console.log(error));
}

function fetchIngredients() {
  return fetch(
    "https://what-s-cookin-starter-kit.herokuapp.com/api/v1/ingredients"
  )
    .then((r) => r.json())
    .then((data) => data.ingredients)
    .catch((error) => console.log(error));
}

function fetchRecipes() {
  return fetch("https://what-s-cookin-starter-kit.herokuapp.com/api/v1/recipes")
    .then((r) => r.json())
    .then((data) => data.recipes)
    .catch((error) => console.log(error));
}

export function fetchData() {
  Promise.all([fetchUser(), fetchIngredients(), fetchRecipes()]).then(
    ([user, ingredient, recipes]) => {
      usersAPIData = user;
      ingredientsAPIData = ingredient;
      recipesAPIData = recipes;
      init();
    }
  );
}
