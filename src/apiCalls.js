// Your fetch requests will live here!

// global.usersAPIData = usersAPIData;
// global.recipesAPIData = recipesAPIData;
// global.ingredientsAPIData = ingredientsAPIData;

import { displayWarning } from '../src/domUpdates.js';

export let usersAPIData;
export let recipesAPIData;
export let ingredientsAPIData;

function fetchData(name) {
  return fetch(`https://what-s-cookin-starter-kit.herokuapp.com/api/v1/${name}`)
    .then((r) => r.json())
    .then((data) => data[name])
    .catch((error) => {
      console.error(error);
      displayWarning('Unable to fetch data. Please try again later.');
    });
}

// fix this because I don't like how this is not really the init function but it also kind of is at the same time
export function fetchServerData() {
  return Promise.all([
    fetchData("users"),
    fetchData("ingredients"),
    fetchData("recipes"),
  ]).then(([users, ingredients, recipes]) => {
    usersAPIData = users;
    ingredientsAPIData = ingredients;
    recipesAPIData = recipes;
  });
}
