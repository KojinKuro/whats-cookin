// Your fetch requests will live here!

export let usersAPIData = []
export let recipesAPIData = []
export let ingredientsAPIData = []

global.usersAPIData = usersAPIData
global.recipesAPIData = recipesAPIData
global.ingredientsAPIData = ingredientsAPIData


function loadUser(){
    return fetch('https://what-s-cookin-starter-kit.herokuapp.com/api/v1/users')
    .then(r => r.json())
    .catch(error => console.log(error))
}

function loadIngredients(){
    return fetch('https://what-s-cookin-starter-kit.herokuapp.com/api/v1/ingredients')
    .then(r => r.json())
    .catch(error => console.log(error))
}

function loadRecipes(){
    return fetch('https://what-s-cookin-starter-kit.herokuapp.com/api/v1/recipes')
    .then(r => r.json())
    .catch(error => console.log(error))
}



function loadData(){
    Promise.all([loadUser(), loadIngredients(), loadRecipes()]).then((values) => {
      console.log(values)
      console.log(values[0])
        usersAPIData = values[0]
       
        ingredientsAPIData = values[1].ingredients
        recipesAPIData = values[2].recipes   
    })
}

global.loadData = loadData



console.log('I will be a fetch request!')

