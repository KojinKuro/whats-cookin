# What's Cookin

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Mocha](https://img.shields.io/badge/-mocha-%238D6748?style=for-the-badge&logo=mocha&logoColor=white)
![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)

A frontend recipe and recipe tracking website. It calls a [backend server](https://github.com/turingschool-examples/whats-cookin-api) for the data using the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)!

![Kapture 2024-03-31 at 15 27 42](https://github.com/KojinKuro/whats-cookin/assets/11234292/b0ab4c26-22ed-4dc6-9082-ff1029c1c494)

## 🌟 Overview

Welcome to What's Cookin'! With this website, you can search through our recipe database using featured tags, a search box, and manually using our infinite scroll feature. Tired of losing recipes? Use our "like" button to save your favorite recipes. This project was created to practice API calls, following TDD, and working on creating a complex web application in a team environment. We used Javascript, HTML, CSS for the core technologies with Mocha & Chai for our test suite.

## 🔗 Live Demo

[👉Live Deployment👈](https://kojinkuro.github.io/whats-cookin/)

Note: You will need our backend server running for the above deployment to work. See [installation](#⚙️-installation--setup)

## ⚙️ Installation & Setup

### Requirements

Running this application requires:

- Git - [how to install](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- NPM -

### Instructions

```
git clone git@github.com:KojinKuro/whats-cookin.git
cd whats-cookin
npm install
npm run start
```

Server URL: `localhost:8080`

### Tests

Test Suite: `npm run test`

## ✨ Features

- This website calls a backend server using API calls that store our recipes
- Allows filtering recipes using a search bar and recipe tags.
- Click a button to get a random recipe
- Save recipes into a list that you can view
- This website has lazy loading implemented to save resources

## 📚 Context

This website was created in our 7th and 8th week of Turing School of Software and Design. This was a group project of three team members. This project took around 75 hours total, averaging 25 hours split amongst each member. This was built according to the following [spec sheet](https://frontend.turing.edu/projects/module-2/whats-cookin-part-one.html). There was no design comp provided for this project so our team designed [our own](https://www.figma.com/file/sASmZkfzWbXObPqYVOh9vQ/Figma-basics?type=design&node-id=1669%3A162202&mode=design&t=KfxDWyuUGfOfMnEr-1).

## 🏆 Wins

1. Learning to work asynchronously, while still creating cohesive code.
2. Using APIs and incorporating them into the website
3. Updating the Data Model before the DOM

## 🚧 Challenges

1. Continuing to learn how to work on a time with different work-time preferences
2. Continuing to improve git workflow
3. Incorporating writing tests into a website

## Troubleshooting & FAQ

### How do I get the application running? This is confusing!

We have a deployment on github pages [here](https://kojinkuro.github.io/whats-cookin/)! Running this application requires some level of you being comfortable using the terminal, and having git and npm installed on your local machine.

### The website is not loading and I got an error saying it was unable fetch data

Make sure you are running our backend server, [provided here](https://github.com/turingschool-examples/whats-cookin-api). None of the data is stored in the program and is on a backend server that needs to be running.

### I'm getting an 422 error when I try to refavorite a previously favorited recipe

This application currently makes POST requests every time that

### When I refresh a page, I cannot refresh any page besides the main page without getting a 404 error

This application is only a frontend to grab data

## Credits

This project was created by [Charles Kwang](https://github.com/KojinKuro), [Ben Wehrend](https://github.com/BenWehrend), and [Laurel Bonal](https://github.com/laurelbonal)

## License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) for more details.
