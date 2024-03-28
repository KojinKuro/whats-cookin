// Your fetch requests will live here!


function getUser(){
    let users;
    fetch('https://what-s-cookin-starter-kit.herokuapp.com/api/v1/users')
    .then(r => r.json())
    .then(data => users = data)
    .catch(error => console.log(error))
    return users
}

function getIngredients(){
    let ingredients;
    fetch('https://what-s-cookin-starter-kit.herokuapp.com/api/v1/ingredients')
    .then(r => r.json())
    .then(data => ingredients = data)
    .catch(error => console.log(error))
    return ingredients
}

function getRecipes(){
    let recipes;
    fetch('https://what-s-cookin-starter-kit.herokuapp.com/api/v1/recipes')
    .then(r => r.json())
    .then(data => recipes = data)
    .catch(error => console.log(error))
    return recipes
}




console.log('I will be a fetch request!')

