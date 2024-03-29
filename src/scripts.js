//NOTE: Data model and non-dom manipulating logic will live in this file.

import "./apiCalls";
import "./styles.css";
// // An example of how you tell webpack to use an image (also need to link to it in the index.html)
// import "./images/turing-logo.png";
// // Below are examples of how you can import functions from either the recipes or domUpdates files.

// all the favorite recipes should be stored as recipe objects here
export let currentUser;

export function getRandomUser(user_dataset) {
  return user_dataset[randomNumber(user_dataset.length)];
}

function randomNumber(max) {
  return Math.floor(Math.random() * max);
}

export function setCurrentUser(user) {
  currentUser = user;
}
