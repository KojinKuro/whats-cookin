import { filterRecipeByTag, getTagRecipeCount } from "../src/tags";
import {
  fetchServerData,
  ingredientsAPIData,
  recipesAPIData,
  sendServerData,
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
const cookbookButton = document.querySelector("button.cookbook");
const savedRecipesButton = document.querySelector("button.saved-recipes");
const randomRecipeButton = document.querySelector(".random-recipe");
// clear buttons query selectors
const filterSettings = document.querySelector(".filter-settings");
const clearSearchButton = document.querySelector(".clear-search");
const clearTagsButton = document.querySelector(".clear-tags");

// EVENT LISTENERS
global.addEventListener("load", function () {
  fetchServerData().then(() => init());
});
global.addEventListener("popstate", (e) => {
  if (!e.state) return;
  const state = e.state;

  switch (state.page) {
    case "directory":
      isSavedRecipesView = state.isSavedRecipesView;
      setPageToDirectory();
      break;
    case "recipe":
      setPageToRecipe(findRecipeFromID(state.id, recipesAPIData));
      break;
  }
});
searchBox.addEventListener("input", function () {
  const recipes = isSavedRecipesView
    ? currentUser.recipesToCook
    : recipesAPIData;

  filterRecipes(recipes);
});
filterSettings.addEventListener("click", function (e) {
  if (e.target.classList.contains("clear-search")) {
    searchBox.value = "";
  } else if (e.target.classList.contains("clear-tags")) {
    clearActiveTags();
  } else if (e.target.classList.contains("tag")) {
    e.target.classList.toggle("tag-active");
  }

  const recipes = isSavedRecipesView
    ? currentUser.recipesToCook
    : recipesAPIData;
  filterRecipes(recipes);
});
mainDirectory.addEventListener("scroll", () => {
  if (isSentinelInView()) displayRecipeCards(recipesToDisplay);
});
main.addEventListener("click", (e) => {
  switch (main.getAttribute("id")) {
    case "directory-page":
      const recipeCard = e.target.closest(".recipe-card");
      if (!recipeCard) return;
      const recipe = findRecipeFromID(recipeCard.dataset.id, recipesAPIData);
      e.preventDefault();

      if (e.target.closest(".heart-container")) {
        const heartContainer = e.target.closest(".heart-container");
        toggleHeart(heartContainer, recipe, currentUser.recipesToCook);
      } else if (e.target.closest(".recipe-image")) {
        setPageToRecipe(recipe);
        history.pushState(
          { page: "recipe", id: `${recipe.id}` },
          "",
          `${recipe.id}`
        );
      }
      break;
    case "recipe-page":
      if (e.target.classList.contains("conversion-slider")) {
        toggleConversion();
        const ingredientsContainer = document.querySelector(".ingredients");
        ingredientsContainer.innerHTML = getIngredientQuantity(
          currentRecipe,
          ingredientsAPIData
        );
      } else if (e.target.closest(".heart-container")) {
        toggleHeart(
          e.target.closest(".heart-container"),
          currentRecipe,
          currentUser.recipesToCook
        );
      } else if (e.target.closest("[name='printer']")) {
        printRecipe(currentRecipe, ingredientsAPIData);
      }
      break;
  }
});

randomRecipeButton.addEventListener("click", () => {
  const randomIndex = randomNumber(recipesAPIData.length);
  const randomRecipe = recipesAPIData[randomIndex];
  setPageToRecipe(randomRecipe);
  history.pushState(
    { page: "recipe", id: `${randomRecipe.id}` },
    "",
    `${randomRecipe.id}`
  );
});

navButtonContainer.addEventListener("click", function (e) {
  if (e.target.classList.contains("cookbook")) {
    isSavedRecipesView = false; /* used for filtering */
  } else if (e.target.classList.contains("saved-recipes")) {
    isSavedRecipesView = true; /* used for filtering */
  } else {
    return;
  }

  setPageToDirectory();
  const url = isSavedRecipesView ? "saved-recipes" : "cookbook";
  history.pushState({ page: "directory", isSavedRecipesView }, "", url);
});

// FUNCTIONS
function init() {
  setCurrentUser(getRandomUser(usersAPIData));
  recipesToDisplay = recipesAPIData;
  displayRecipeCards(recipesToDisplay);
  updateTags(recipesToDisplay);
  history.replaceState(
    { page: "directory", isSavedRecipesView },
    "",
    document.location.href
  );
}

const infiniteLoad = (function () {
  let currentPage = 0;
  const recipesPerPage = 8;

  function resetView() {
    viewChanged = false;
    mainDirectory.innerHTML = "";
    mainDirectory.scrollTop = 0;
    currentPage = 0;
  }

  return function (recipes) {
    if (viewChanged) resetView();
    const sentinel = document.querySelector(".sentinel");
    if (sentinel) sentinel.remove();

    const recipesToRender = recipes.slice(
      currentPage * recipesPerPage,
      (currentPage + 1) * recipesPerPage
    );
    recipesToRender.forEach((recipe, index) => {
      if (index == recipesToRender.length - 2)
        mainDirectory.append(createSentinelHTML());
      mainDirectory.append(createRecipeHTML(recipe));
    });

    currentPage++;
  };
})();

function resetFilters(recipeDataset) {
  searchBox.value = "";
  const activeTags = tagsContainer.querySelectorAll(".tag-active");
  activeTags.forEach((tag) => tag.classList.remove("tag-active"));
  updateTags(recipeDataset);
}

function displayRecipeCards(recipeDataset) {
  if (!recipeDataset || !recipeDataset.length) {
    mainDirectory.style.justifyContent = "center";
    mainDirectory.innerHTML =
      '<div class="gatile" style="text-align: center; font-size: 5vh">No recipes found.</div>';
  } else {
    mainDirectory.style.justifyContent = null;
    infiniteLoad(recipeDataset);
  }
}

function createSentinelHTML() {
  const sentinel = document.createElement("div");
  sentinel.classList.add("sentinel");
  return sentinel;
}

function createRecipeHTML(recipe) {
  const article = document.createElement("article");
  article.setAttribute("class", "recipe-card");
  article.setAttribute("data-id", recipe.id);
  article.setAttribute("tabindex", "0");

  const heartIcon = isRecipeFavorited(recipe, currentUser.recipesToCook)
    ? "<box-icon class='heart' animation='tada-hover' size='md' name='heart' type='solid' color='#b30202'></box-icon>"
    : "<box-icon class='heart' animation='tada-hover' size='md' name='heart' ></box-icon>";

  isRecipeFavorited(recipe, currentUser.recipesToCook)
    ? addRecipeToArray(currentUser.recipesToCook, recipe)
    : removeRecipeFromArray(currentUser.recipesToCook, recipe);

  const recipeTags = recipe.tags.length ? recipe.tags.join(", ") : "no-tags";

  article.innerHTML = `
    <div class="recipe-image">
      <img src="${recipe.image}" alt="${recipe.name}">
      <box-icon class='link' name='link-external'></box-icon>
    </div>
    <div class="recipe-info">
      <div class="tags-and-heart">
        <h3 class="recipe-tags">${recipeTags}</h3>
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
    ? "<box-icon class='heart' animation='tada-hover' size='md' name='heart' type='solid' color='#b30202'></box-icon>"
    : "<box-icon class='heart' animation='tada-hover' size='md' name='heart' ></box-icon>";

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
          <div>Cost: $${calculateRecipeCost(recipe, ingredientsAPIData)}</div>
          <div class="conversion-container">
            <label class="switch">
              <span class="weight-conversion">US/Metric:</span>
              <input type="checkbox"${checkboxChecked} class="conversion-slider">
              <span class="slider round"></span>
            </label>
          </div>
        </div>
        <hr />
        <ul class="ingredients">${getIngredientQuantity(
          recipe,
          ingredientsAPIData
        )}</ul>
        <hr>
        <box-icon class='print-icon' name='printer' type='solid' color='black' size='md'></box-icon>
      </div>
    </div>`;

  return recipeContainer;
}

function getIngredientQuantity(recipe, ingredientDataset) {
  const ingredientList = findRecipeIngredients(recipe, ingredientDataset);
  const quantityList = findRecipeIngredientsQuantity(recipe, convertToUS);

  return ingredientList
    .map((ingredient, index) => {
      return `<li><div class="ingredient-name">${ingredient}</div><div class="ingredient-amount">${quantityList[index]}</div></li>`;
    })
    .join("");
}

function toggleHeart(element, recipe, recipeDataset) {
  const isFavorited = isRecipeFavorited(recipe, recipeDataset);
  if (!isFavorited) {
    element.innerHTML =
      "<box-icon class='heart' animation='tada-hover' size='md' name='heart' type='solid' color='#b30202'></box-icon>";
    addRecipeToArray(recipeDataset, recipe);
    sendServerData(currentUser.id, recipe.id);
  } else {
    element.innerHTML =
      "<box-icon class='heart' animation='tada-hover' size='md' name='heart'></box-icon>";
    removeRecipeFromArray(recipeDataset, recipe);
  }
}

function setPageToDirectory() {
  navButtonContainer
    .querySelectorAll("button")
    .forEach((button) => button.classList.remove("selected"));
  if (!isSavedRecipesView) {
    cookbookButton.classList.add("selected");
    recipesToDisplay = recipesAPIData;
  } else {
    savedRecipesButton.classList.add("selected");
    recipesToDisplay = currentUser.recipesToCook;
  }

  viewChanged = true;
  filterSection.classList.remove("hidden");
  mainDirectory.innerHTML = "";
  main.setAttribute("id", "directory-page");
  displayRecipeCards(recipesToDisplay);
  resetFilters(recipesToDisplay);
  // jank bug fix for recipe page
  body.style.cssText = "--sidebar-width: 300px";
}

function setPageToRecipe(recipe) {
  navButtonContainer
    .querySelectorAll("button")
    .forEach((button) => button.classList.remove("selected"));

  setCurrentRecipe(recipe);

  main.innerHTML = "";
  main.append(createRecipePageHTML(recipe));
  main.setAttribute("id", "recipe-page");
  filterSection.classList.add("hidden");
  // jank bug fix for recipe page
  body.style.cssText = "--sidebar-width: 0px";
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

const filterRecipes = (recipes) => {
  viewChanged = true;

  recipesToDisplay = search(
    searchBox.value.trim(),
    filterRecipeByTag(getActiveTags(), recipes),
    ingredientsAPIData
  );

  displayRecipeCards(recipesToDisplay);
  updateTags(recipesToDisplay);
  updateClearFilterButtons();
};

const displayWarning = (message, iconName = "bug-alt") => {
  const warningMessageContainer = document.querySelector(".warning-container");
  if (!warningMessageContainer) return;

  const warning = document.createElement("div");
  warning.classList.add("warning");
  warning.innerHTML = `
  <box-icon color='white' name='${iconName}'></box-icon>
  ${message}`;
  warningMessageContainer.appendChild(warning);

  setTimeout(() => {
    warningMessageContainer.querySelector(".warning").remove();
  }, 3000);
};

function printRecipe(recipe, ingredientDataset) {
  const quantityList = findRecipeIngredientsQuantity(recipe, convertToUS);
  const ingredientList = findRecipeIngredients(recipe, ingredientDataset)
    .map(
      (ingredient, index) =>
        `<li><div>${ingredient} ${quantityList[index]}</div></li>`
    )
    .join("");

  const instructionsList = findRecipeInstructions(recipe)
    .map((instruction) => `<li>${instruction}</li>`)
    .join("");

  const printWindow = window.open("", "_blank", "height=600,width=800");
  printWindow.document.write(`
  <html>
    <head>
      <title>Print</title>
    </head>
    <body>
      <h1>${recipe.name}</h1>
      <h2>Ingredients</h2>
      <ul>${ingredientList}</ul>
      <h2>Instructions</h2>
      <ol>${instructionsList}</ol>
    </body>
  </html>`);

  printWindow.document.close(); // necessary for IE >= 10
  printWindow.focus(); // necessary for IE >= 10*/
  printWindow.onafterprint = printWindow.close;
  printWindow.print();
}

export { displayRecipeCards as displayRecipes, displayWarning };
