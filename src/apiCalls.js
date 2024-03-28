// Your fetch requests will live here!

export let usersAPIData = [];
export let recipesAPIData = [];
export let ingredientsAPIData = [];

// global.usersAPIData = usersAPIData;
// global.recipesAPIData = recipesAPIData;
// global.ingredientsAPIData = ingredientsAPIData;

function loadUser() {
  return fetch("https://what-s-cookin-starter-kit.herokuapp.com/api/v1/users")
    .then((r) => r.json())
    .then((data) => data.users)
    .catch((error) => console.log(error));
}

function loadIngredients() {
  return fetch(
    "https://what-s-cookin-starter-kit.herokuapp.com/api/v1/ingredients"
  )
    .then((r) => r.json())
    .then((data) => data.ingredients)
    .catch((error) => console.log(error));
}

function loadRecipes() {
  return fetch("https://what-s-cookin-starter-kit.herokuapp.com/api/v1/recipes")
    .then((r) => r.json())
    .then((data) => data.recipes)
    .catch((error) => console.log(error));
}

function loadData() {
  Promise.all([loadUser(), loadIngredients(), loadRecipes()]).then(
    ([user, ingredient, recipes]) => {
      usersAPIData = user;
      ingredientsAPIData = ingredient;
      recipesAPIData = recipes;
    }
  );
}

function printData() {
  console.log(usersAPIData);
  console.log(ingredientsAPIData);
  console.log(recipesAPIData);
}

global.loadData = loadData;
global.printData = printData;
