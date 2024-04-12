// Your fetch requests will live here!

// global.usersAPIData = usersAPIData;
// global.recipesAPIData = recipesAPIData;
// global.ingredientsAPIData = ingredientsAPIData;

import { displayWarning } from "../src/domUpdates.js";

export let usersAPIData;
export let recipesAPIData;
export let ingredientsAPIData;

function fetchData(name) {
  return fetch(`http://localhost:3001/api/v1/${name}`)
    .then((r) => r.json())
    .then((data) => data[name])
    .catch((error) => {
      console.error(error);
      displayWarning(`Unable to fetch ${name} data. Please try again later.`);
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


export function sendServerData(userID, recipeID){
  const IDs = { 
    userID: userID, 
    recipeID: recipeID
  }
  fetch(`http://localhost:3001/api/v1/usersRecipes`, {
    method: "POST",
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(IDs)
  })
  .then(response => {
    if(!response.ok){
      throw new Error(`Error ${response.status}`)
    } 
    return response.json()
  })
  .then(data => {
    console.log(data.message)
    return data
  })
  .catch((error) => {
    console.error(error);
    displayWarning(`Unable to save favorite recipe :(`);
  });
}