import { filterRecipeByTag, getTagRecipeCount } from "../src/tags";
import recipeData from "./data/recipes";
import {
  findRecipeFromID,
  findRecipeIngredients,
  findRecipeIngredientsQuantity,
  findRecipeInstructions,
} from "./recipes";

//Here is an example function just to demonstrate one way you can export/import between the two js files. You'll want to delete this once you get your own code going.

let recipesToDisplay = [];

const tagsContainer = document.querySelector(".tags-container");
const main = document.querySelector("main");
const mainDirectory = document.getElementById("directory-page");
const mainRecipe = document.getElementById("recipe-page");
const filterSection = document.querySelector("nav.filter-container");

addEventListener("load", init);
tagsContainer.addEventListener("click", function (e) {
  if (!e.target.classList.contains("tag")) return;

  e.target.classList.toggle("tag-active");
  recipesToDisplay = filterRecipeByTag(getActiveTags());
  displayRecipes(recipesToDisplay);
  updateTagsToDOM();
});
mainDirectory.addEventListener("click", (e) => {
  if (!e.target.closest(".recipe-card")) return;
  const clickedRecipe = e.target.closest(".recipe-card");
  const recipe = findRecipeFromID(clickedRecipe.dataset.id, recipeData);

  main.innerHTML = "";
  main.append(createRecipePageHTML(recipe));
  main.setAttribute("id", "recipe-page");
  filterSection.classList.add("hidden");
});

// FUNCTIONS
function init() {
  recipesToDisplay = recipesToDisplay.concat(recipeData);
  displayRecipes(recipesToDisplay);
  updateTagsToDOM();
}

function displayRecipes(dataBase) {
  mainDirectory.innerHTML = "";
  dataBase.forEach((recipe) => mainDirectory.append(createRecipeHTML(recipe)));
  console.log(`Displaying recipes now`);
}

function createRecipeHTML(recipe) {
  const article = document.createElement("article");
  article.classList.add("recipe-card");
  article.dataset.id = recipe.id;

  article.innerHTML = `
    <div class="recipe-image">
      <img src="${recipe.image}" alt="${recipe.name}">
    </div>
    <div class="recipe-info">
      <div class="tags-and-heart">
        <h3 class="recipe-tags">${recipe.tags.join(", ")}</h3>
        <svg class="heart" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
          style="
            fill: rgba(157, 150, 139, 1);
            transform: scaleX(-1);
            msFilter: 'progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)';
          ">
          <path d="M12 4.595a5.904 5.904 0 0 0-3.996-1.558 5.942 5.942 0 0 0-4.213 1.758c-2.353 2.363-2.352 6.059.002 8.412l7.332 7.332c.17.299.498.492.875.492a.99.99 0 0 0 .792-.409l7.415-7.415c2.354-2.354 2.354-6.049-.002-8.416a5.938 5.938 0 0 0-4.209-1.754A5.906 5.906 0 0 0 12 4.595zm6.791 1.61c1.563 1.571 1.564 4.025.002 5.588L12 18.586l-6.793-6.793c-1.562-1.563-1.561-4.017-.002-5.584.76-.756 1.754-1.172 2.799-1.172s2.035.416 2.789 1.17l.5.5a.999.999 0 0 0 1.414 0l.5-.5c1.512-1.509 4.074-1.505 5.584-.002z"></path>
        </svg>
      </div>
      <h2 class="recipe-name">${recipe.name}</h2>
      <h3 class="recipe-ingredients">
        <span class="label">Ingredients:</span> ${findRecipeIngredients(
          recipe
        ).join(", ")}
      </h3>
    </div>
  `;

  return article;
}

function createRecipePageHTML(recipe) {
  const recipeContainer = document.createElement("div");
  recipeContainer.classList.add("recipe-container");

  const instructionsList = findRecipeInstructions(recipe).reduce(
    (innerHTML, instruction) => {
      innerHTML += `<li>${instruction}</li>`;
      return innerHTML;
    },
    ""
  );

  const ingredientList = findRecipeIngredients(recipe);
  const quantityList = findRecipeIngredientsQuantity(recipe);

  let ingredientQuantityHTML = ingredientList
    .map((ingredient, index) => {
      return `<li>
      <div class="ingredient-name">${ingredient}</div>
      <div class="ingredient-amount">${quantityList[index]}</div>
    </li>`;
    })
    .join("");

  recipeContainer.innerHTML = `
    <div class="recipe-title">
      <div class="image-container">
        <img src="${recipe.image}" alt="${recipe.name}"/>
      </div>
      <h1>${recipe.name}</h1>
    </div>
    <div class="instructions">
      <h1>Instructions</h1>
      <ol>${instructionsList}</ol>
    </div>
    <div class="ingredients">
      <h1>Ingredients</h1>
      <ul>${ingredientQuantityHTML}</ul>
    </div>`;

  return recipeContainer;
}

function getActiveTags() {
  const activeTags = document.querySelectorAll(".tag-active");
  return Array.from(activeTags).map((button) => button.dataset.tag);
}

function updateTagsToDOM() {
  const activeTags = getActiveTags();
  const tagRecipeCount = getTagRecipeCount(activeTags);
  const tagNames = Object.keys(tagRecipeCount);

  tagsContainer.innerHTML = "";
  tagNames.forEach((tagName) => {
    const button = document.createElement("button");
    button.className = "tag";
    if (activeTags.includes(tagName)) button.classList.add("tag-active");
    button.dataset.tag = tagName;
    button.textContent = `${tagName} (${tagRecipeCount[tagName]})`;
    tagsContainer.appendChild(button);
  });
}

export { displayRecipes };
