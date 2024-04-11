import { filterRecipeByTag, getTagRecipeCount } from "../src/tags";
import {
  fetchData,
  ingredientsAPIData,
  recipesAPIData,
  usersAPIData,
} from "./apiCalls";
import { calculateRecipeCost } from "./cost";
import {
  addRecipeToArray,
  findRecipeFromID,
  findRecipeIngredients,
  findRecipeIngredientsQuantity,
  findRecipeInstructions,
  isRecipeFavorited,
  removeRecipeFromArray,
} from "./recipes";
import {
  convertToUS,
  currentRecipe,
  currentUser,
  getRandomUser,
  randomNumber,
  setCurrentRecipe,
  setCurrentUser,
  toggleConversion,
} from "./scripts";
import { search } from "./search";

let recipesToDisplay;
let viewChanged = false;
let isSavedRecipesView = false;

const body = document.querySelector("body");
const logo = document.querySelector(".logo");
// main view query selectors
const main = document.querySelector("main");
const mainDirectory = document.getElementById("directory-page");
const mainRecipe = document.getElementById("recipe-page");
// Filter query selectors
const filterSection = document.querySelector("nav.filter-container");
const searchBox = document.querySelector(".search-box");
const tagsContainer = document.querySelector(".tags-container");
// changing view query selectors
const navButtonContainer = document.querySelector(".nav-buttons");
const randomRecipeButton = document.querySelector(".random-recipe");
// clear buttons query selectors
const filterSettings = document.querySelector(".filter-settings");
const clearSearchButton = document.querySelector(".clear-search");
const clearTagsButton = document.querySelector(".clear-tags");

const heartOn =
  '<svg class="heart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style="fill: #b30202;transform: ;msFilter:;"><path d="M20.205 4.791a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412L12 21.414l8.207-8.207c2.354-2.353 2.355-6.049-.002-8.416z"></path></svg>';
const heartOff = `<svg class="heart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" style=" fill: rgba(157, 150, 139, 1); transform: scaleX(-1); msFilter: 'progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)';"> <path d="M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z"></path></svg>`;

// EVENT LISTENERS
addEventListener("load", fetchData);
searchBox.addEventListener("input", function () {
  filterRecipes();
});
filterSettings.addEventListener("click", function (e) {
  if (e.target.classList.contains("clear-search")) {
    searchBox.value = "";
  } else if (e.target.classList.contains("clear-tags")) {
    clearActiveTags();
  } else if (e.target.classList.contains("tag")) {
    e.target.classList.toggle("tag-active");
  }

  filterRecipes();
});
mainDirectory.addEventListener("scroll", () => {
  if (isSentinelInView()) displayRecipeCards(recipesToDisplay);
});
main.addEventListener("click", (e) => {
  switch (main.getAttribute("id")) {
    case "directory-page":
      if (!e.target.closest(".recipe-card")) return;

      const clickedRecipe = e.target.closest(".recipe-card");
      const recipe = findRecipeFromID(clickedRecipe.dataset.id, recipesAPIData);
      setCurrentRecipe(recipe);

      if (e.target.closest(".heart-container")) {
        toggleHeart(
          e.target.closest(".heart-container"),
          currentRecipe,
          currentUser.recipesToCook
        );
      } else {
        main.innerHTML = "";
        main.append(createRecipePageHTML(currentRecipe));
        main.setAttribute("id", "recipe-page");
        filterSection.classList.add("hidden");
        // jank bug fix for recipe page
        body.style.cssText = "--sidebar-width: 0px";
      }
      break;
    case "recipe-page":
      if (e.target.classList.contains("conversion-slider")) {
        toggleConversion();
        const ingredientsContainer = document.querySelector(".ingredients");
        ingredientsContainer.innerHTML = `${getIngredientQuantity(
          currentRecipe,
          ingredientsAPIData
        )}`;
      } else if (e.target.closest(".heart-container")) {
        toggleHeart(
          e.target.closest(".heart-container"),
          currentRecipe,
          currentUser.recipesToCook
        );
      }
      break;
  }
});
randomRecipeButton.addEventListener("click", () => {
  const randomIndex = randomNumber(recipesAPIData.length);
  const randomRecipe = recipesAPIData[randomIndex];
  setCurrentRecipe(randomRecipe);

  main.innerHTML = "";
  main.append(createRecipePageHTML(randomRecipe));
  main.setAttribute("id", "recipe-page");
  filterSection.classList.add("hidden");
  // jank bug fix for recipe page
  body.style.cssText = "--sidebar-width: 0px";
});

navButtonContainer.addEventListener("click", function (e) {
  this.querySelectorAll("button").forEach((button) =>
    button.classList.remove("selected")
  );
  e.target.classList.add("selected");

  if (e.target.classList.contains("cookbook")) {
    isSavedRecipesView = false; /* used for filtering */
    recipesToDisplay = recipesAPIData;
  } else if (e.target.classList.contains("saved-recipes")) {
    isSavedRecipesView = true; /* used for filtering */
    recipesToDisplay = currentUser.recipesToCook;
  } else {
    return;
  }

  viewChanged = true;
  filterSection.classList.remove("hidden");
  // jank bug fix for recipe page
  body.style.cssText = "--sidebar-width: 300px";

  mainDirectory.innerHTML = "";
  main.setAttribute("id", "directory-page");
  displayRecipeCards(recipesToDisplay);
  resetFilters(recipesToDisplay);
});

// FUNCTIONS
export function init() {
  setCurrentUser(getRandomUser(usersAPIData));
  recipesToDisplay = recipesAPIData;
  displayRecipeCards(recipesToDisplay);
  updateTags(recipesToDisplay);
  logo.innerText += ` ${currentUser.name}`;
}

const infiniteLoad = (function () {
  let currentPage = 1;
  const recipesPerPage = 5;

  function resetView() {
    viewChanged = false;
    mainDirectory.scrollTop = 0;
    currentPage = 1;
  }

  return function (recipes) {
    if (viewChanged) resetView();

    const recipesToRender = recipes.slice(0, currentPage * recipesPerPage);
    recipesToRender.forEach((recipe) =>
      mainDirectory.append(createRecipeHTML(recipe))
    );
    currentPage++;

    const sentinel = document.querySelector(".sentinel");
    if (sentinel) sentinel.remove();
    mainDirectory.append(createSentinelHTML());
  };
})();

function resetFilters(recipe_dataset) {
  searchBox.value = "";
  const activeTags = tagsContainer.querySelectorAll(".tag-active");
  activeTags.forEach((tag) => tag.classList.remove("tag-active"));
  updateTags(recipe_dataset);
}

function displayRecipeCards(recipe_dataset) {
  if (!recipe_dataset || !recipe_dataset.length) {
    mainDirectory.style.justifyContent = "center";
    mainDirectory.innerHTML =
      '<div class="gatile" style="text-align: center; font-size: 5vh">No recipes found.</div>';
  } else {
    mainDirectory.style.justifyContent = null;
    mainDirectory.innerHTML = "";
    infiniteLoad(recipe_dataset);
  }
}

function createSentinelHTML() {
  const sentinel = document.createElement("div");
  sentinel.classList.add("sentinel");
  return sentinel;
}

function createRecipeHTML(recipe) {
  const article = document.createElement("article");
  article.classList.add("recipe-card");
  article.dataset.id = recipe.id;

  const heartIcon = isRecipeFavorited(recipe, currentUser.recipesToCook)
    ? heartOn
    : heartOff;

  isRecipeFavorited(recipe, currentUser.recipesToCook)
    ? addRecipeToArray(currentUser.recipesToCook, recipe)
    : removeRecipeFromArray(currentUser.recipesToCook, recipe);

  const recipeTags = recipe.tags.length
    ? `<h3 class="recipe-tags">${recipe.tags.join(", ")}</h3>`
    : "";

  article.innerHTML = `
    <div class="recipe-image">
      <img src="${recipe.image}" alt="${recipe.name}">
    </div>
    <div class="recipe-info">
      <div class="tags-and-heart">
        ${recipeTags}
        <div class="heart-container">${heartIcon}</div>
      </div>
      <h2 class="recipe-name">${recipe.name}</h2>
      <h3 class="recipe-ingredients">
      <span class="label"> ingredients </span>
      ${findRecipeIngredients(recipe, ingredientsAPIData).join(", ")}
    </h3>
    </div>`;

  return article;
}

function createTagHTML(tagName, number) {
  const tagNumber = number ? number : 0;

  const button = document.createElement("button");
  button.classList.add("tag");
  button.dataset.tag = tagName;
  button.textContent = `${tagName} (${tagNumber})`;
  return button;
}

function createRecipePageHTML(recipe) {
  const recipeContainer = document.createElement("div");
  recipeContainer.classList.add("recipe-container");
  recipeContainer.dataset.id = recipe.id;

  const instructionsList = findRecipeInstructions(recipe).reduce(
    (innerHTML, instruction) => {
      innerHTML += `<li>${instruction}</li>`;
      return innerHTML;
    },
    ""
  );

  const heartIcon = isRecipeFavorited(recipe, currentUser.recipesToCook)
    ? heartOn
    : heartOff;

  const checkboxChecked = convertToUS ? "" : "checked";

  recipeContainer.innerHTML = `
    <div class="recipe-main">
      <div class="image-container">
        <img src="${recipe.image}" alt="${recipe.name}"/>
      </div>
      <div class="title-container">
        <h1 class="title gatile">${recipe.name}</h1>
      </div>
    </div>
    <div class="instructions">
      <h1 class="gatile">Instructions</h1>
      <ol>${instructionsList}</ol>
    </div>
    <div class="ingredients-container">
      <div class="ingredients-background">
        <div class="ingredients-and-heart">
          <h1 class="gatile">Ingredients</h1>
          <div class="heart-container">${heartIcon}</div>
        </div>
        <div class="ingredient-settings">
        <div>$${calculateRecipeCost(recipe, ingredientsAPIData)}</div>
          <label class="switch">
            <input type="checkbox" ${checkboxChecked} class="conversion-slider">
            <span class="slider round"></span>
          </label>
        </div>
        <hr />
        <ul class="ingredients">${getIngredientQuantity(
          recipe,
          ingredientsAPIData
        )}</ul>
      </div>
    </div>`;

  return recipeContainer;
}

function getIngredientQuantity(recipe, ingredient_dataset) {
  const ingredientList = findRecipeIngredients(recipe, ingredient_dataset);
  const quantityList = findRecipeIngredientsQuantity(recipe, convertToUS);

  return ingredientList
    .map((ingredient, index) => {
      return `<li><div class="ingredient-name">${ingredient}</div><div class="ingredient-amount">${quantityList[index]}</div></li>`;
    })
    .join("");
}

function toggleHeart(element, recipe, recipe_dataset) {
  const isFavorited = isRecipeFavorited(recipe, recipe_dataset);
  if (!isFavorited) {
    element.innerHTML = heartOn;
    addRecipeToArray(recipe_dataset, recipe);
  } else {
    element.innerHTML = heartOff;
    removeRecipeFromArray(recipe_dataset, recipe);
  }
}

function getActiveTags() {
  const activeTags = document.querySelectorAll(".tag-active");
  return Array.from(activeTags).map((button) => button.dataset.tag);
}

function clearActiveTags() {
  const activeTags = tagsContainer.querySelectorAll(".tag-active");
  activeTags.forEach((tag) => tag.classList.remove("tag-active"));
}

function updateTags(recipes) {
  const activeTags = getActiveTags();
  const tagRecipeCount = getTagRecipeCount(activeTags, recipes);
  const tagNames = Object.keys(tagRecipeCount);

  tagsContainer.innerHTML = "";
  activeTags.sort().forEach((tagName) => {
    const tag = createTagHTML(tagName, tagRecipeCount[tagName]);
    tag.classList.add("tag-active");
    tagsContainer.appendChild(tag);
  });
  tagNames.forEach((tagName) => {
    if (activeTags.find((activeTag) => activeTag === tagName)) return;
    const tag = createTagHTML(tagName, tagRecipeCount[tagName]);
    tagsContainer.appendChild(tag);
  });
}

function isSentinelInView() {
  const sentinel = document.querySelector(".sentinel");
  if (!sentinel) return false;
  const rect = sentinel.getBoundingClientRect();
  return rect.top <= window.innerHeight;
}

function updateClearFilterButtons() {
  searchBox.value
    ? clearSearchButton.classList.remove("hidden")
    : clearSearchButton.classList.add("hidden");

  getActiveTags().length
    ? clearTagsButton.classList.remove("hidden")
    : clearTagsButton.classList.add("hidden");
}

const filterRecipes = () => {
  const recipes = isSavedRecipesView
    ? currentUser.recipesToCook
    : recipesAPIData;

  recipesToDisplay = search(
    searchBox.value.trim(),
    filterRecipeByTag(getActiveTags(), recipes),
    ingredientsAPIData
  );

  displayRecipeCards(recipesToDisplay);
  updateTags(recipesToDisplay);
  updateClearFilterButtons();
};

export { displayRecipeCards as displayRecipes };
