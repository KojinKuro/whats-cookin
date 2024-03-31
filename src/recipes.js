//Here is an example demonstrating logic separated that can be imported into the scripts and test files. Feel free to update this later!
import convert from "convert-units";
import { sanitizeString } from "./search";

export const findRecipeIngredients = (recipe, ingredient_dataset) => {
  return recipe.ingredients.reduce((list, recipeIngredient) => {
    list.push(findIngredient(recipeIngredient.id, ingredient_dataset).name);
    return list;
  }, []);
};

export function findRecipeIngredientsQuantity(recipe, convertToUS) {
  return recipe.ingredients.map((ingredient) => {
    const amount = ingredient.quantity.amount;
    const unit = sanitizeUnit(ingredient.quantity.unit);
    const converted = ingredientConvertor(amount, unit, convertToUS);
    console.log(converted);
    const space = unit.length ? " " : "";

    return `${+converted.amount.toFixed(2)}${space}${converted.unit}`;
  });
}

function sanitizeUnit(unit) {
  const measurements = {
    // volume metric
    ml: ["milliliter", "ml"],
    l: ["l", "litter"],
    // volume US
    tsp: ["teaspoon", "tsp", "t"],
    Tbs: ["tablespoon", "tbsp", "tbs"],
    "fl-oz": ["fluid ounce", "fl-oz", "fl oz"],
    cup: ["c", "cup"],
    pnt: ["pint"],
    qt: ["quart", "qt"],
    gal: ["gallon", "gal"],
    // mass metric
    g: ["g", "gram"],
    kg: ["kilogram", "kg"],
    // mass US
    oz: ["ounce", "oz"],
    lb: ["pound", "lb"],
  };

  const sanitizedUnit = sanitizeString(unit);
  const units = Object.keys(measurements);
  const convertedUnit = units.find((unit) =>
    measurements[unit].find(
      (unitName) =>
        sanitizedUnit === unitName || sanitizedUnit === `${unitName}s`
    )
  );

  if (convertedUnit) return convertedUnit;
  else return unit;
}

function ingredientConvertor(amountToConvert, unitToConvert, convertToUS) {
  try {
    const toConvert = convert(amountToConvert).from(unitToConvert);
    const possibleMeasurements = toConvert.possibilities();
    let unitToConvertTo;

    if (possibleMeasurements.includes("oz")) {
      unitToConvertTo = convertToUS ? "oz" : "g";
    } else if (possibleMeasurements.includes("cup")) {
      unitToConvertTo = convertToUS ? "cup" : "ml";
    } else {
      unitToConvertTo = unitToConvert;
    }

    const convertedIngredient = toConvert.to(unitToConvertTo);
    const convertedIngredientBest = convert(convertedIngredient)
      .from(unitToConvertTo)
      .toBest({
        exclude: [
          "pnt",
          "fl-oz",
          "mcg",
          "mg",
          "mt",
          "t",
          "mm3",
          "m3",
          "km3",
          "in3",
          "ft3",
          "yd3",
          "cl",
          "tsk",
          "cm3",
          "msk",
          "dl",
          "glas",
          "kkp",
        ],
      });

    return {
      amount: convertedIngredientBest.val,
      unit: convertedIngredientBest.unit,
    };
  } catch (error) {
    return {
      amount: amountToConvert,
      unit: unitToConvert,
    };
  }
}

export const findRecipeInstructions = (recipe) => {
  return recipe.instructions
    .sort((a, b) => a.number - b.number)
    .map((step) => step.instruction);
};

export function findIngredient(ingredientID, ingredient_dataset) {
  return ingredient_dataset.find(
    (ingredientData) => ingredientData.id == ingredientID
  );
}

export function addRecipeToArray(recipesArray, recipeToAdd) {
  const recipeExists = recipesArray.some(
    (recipe) => recipe.id === recipeToAdd.id
  );
  if (!recipeExists) {
    recipesArray.push(recipeToAdd);
  }
}

export function removeRecipeFromArray(recipesArray, recipeToRemove) {
  const recipeIndex = recipesArray.findIndex(
    (recipe) => recipe.id === recipeToRemove.id
  );
  if (recipeIndex > -1) {
    recipesArray.splice(recipeIndex, 1);
  }
}

export function findRecipeFromID(recipeID, recipe_dataset) {
  return recipe_dataset.find((recipe) => recipe.id === +recipeID);
}

export function isFavorited(favoriteRecipes, recipe_dataset) {
  return favoriteRecipes.filter((recipe) =>
    recipe_dataset.some((dataRecipe) => dataRecipe.id === recipe.id)
  );
}

export function isRecipeFavorited(recipe, recipe_dataset) {
  return recipe_dataset.find((currentRecipe) => {
    return currentRecipe.id === recipe.id;
  });
}
