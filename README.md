# 🍳 What's Cookin

![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)
![Mocha](https://img.shields.io/badge/-mocha-%238D6748?style=for-the-badge&logo=mocha&logoColor=white)
![Webpack](https://img.shields.io/badge/webpack-%238DD6F9.svg?style=for-the-badge&logo=webpack&logoColor=black) ![NPM](https://img.shields.io/badge/NPM-%23CB3837.svg?style=for-the-badge&logo=npm&logoColor=white)

A frontend recipe and recipe tracking website. It calls a [backend server](https://github.com/turingschool-examples/whats-cookin-api) for the data using the [fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)!

![Kapture 2024-03-31 at 15 27 42](https://github.com/KojinKuro/whats-cookin/assets/11234292/b0ab4c26-22ed-4dc6-9082-ff1029c1c494)

## 🌟 Overview

Welcome to What's Cookin'! With this website, you can search through our recipe database using featured tags, a search box, and manually using our infinite scroll feature. Tired of losing recipes? Use our "like" button to save your favorite recipes. This project was created to practice API calls, following TDD, and working on creating a complex web application in a team environment. We used Javascript, HTML, CSS for the core technologies with Mocha & Chai for our test suite.

## ✨ Features

- View and save recipes in a favorite recipes list
- Uses a backend server using API calls to `GET` and `POST` data
- Filter recipes using a search bar and/or recipe tags.
- Not sure what to eat? Click on our random recipe button
- Print recipes that you enjoy in our low-ink mode
- Lazy loading to save on memory usage
- Accessibility focused design with 0 WAVE errors and 100% on Chrome Lighthouse

## 🔗 Live Demo

[👉Live Deployment👈](https://kojinkuro.github.io/whats-cookin/)

**Note:** This website requires a [backend server](https://github.com/turingschool-examples/whats-cookin-api) to be running for it to properly work. The [instructions](#instructions) below will help you get running!

## ⚙️ Installation & Setup

### Requirements

Running this application requires:

- Git - version control software you can [install here](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
- NPM - package manager that is [part of Node.js](https://nodejs.org/en)

### Instructions

1. Follow the instructions in [this repo](https://github.com/turingschool-examples/whats-cookin-api) to pull down and get the backend API server running.
2. Pull down the code for the frontend website

```
git clone git@github.com:KojinKuro/whats-cookin.git
```

3. Navigate into the `whats-cookin` folder

```
cd whats-cookin
```

4. Install the required node packages

```
npm install
```

5. Start the frontend dev server

```
npm run start
```

The frontend server should be running on `localhost:8080`

### Tests

Our code also includes a full test suite that we used for testing the core functionality of our application. If you would like to run our test suite, use the following command in your terminal after installing the required node packages:

```
npm run test
```

## 📚 Context

This website was created in our 7th and 9th week of Turing School of Software and Design. There was a small break during our 8th week. This was a group project of three team members. This project took around 100 hours total, averaging 35 hours split amongst each member. This project was built according to the following [spec sheet](https://frontend.turing.edu/projects/module-2/whats-cookin-part-one.html). There was no design comp provided for this project so our team designed [our own](https://www.figma.com/file/sASmZkfzWbXObPqYVOh9vQ/Figma-basics?type=design&node-id=1669%3A162202&mode=design&t=KfxDWyuUGfOfMnEr-1).

## 🏆 Wins

- Learning to work asynchronously, while still creating cohesive code.
- Using APIs and incorporating them into the website
- Updating the Data Model before the DOM

## 🚧 Challenges

- Continuing to learn how to work on a time with different work-time preferences
- Continuing to improve git workflow
- Incorporating writing tests into a website

## ❓ Troubleshooting & FAQ

### How do I get the application running? This is confusing!

We have a deployment on [github pages](https://kojinkuro.github.io/whats-cookin/)! Even still, this website does not work unless you have our backend server running. Doing requires you being comfortable using the terminal, and having git and npm installed on your local machine. See our [instructions](#instructions) for more details.

### The website is not loading and I got an error saying it was unable fetch data

Make sure you are running our backend server, [provided here](https://github.com/turingschool-examples/whats-cookin-api). None of the data is stored in the program and is on a backend server that needs to be running.

### I'm getting an 422 error when I try to refavorite a previously favorited recipe

The site makes POST requests every time that a recipe is favorited, but does not make DELETE requests recipes are unfavorited. This means you will get an error trying to refavorite the same recipe; because, it is already in the server. DELETE requests were out side of the scope of our project but are something we'd like to implement in the future.

### When I refresh a page, I cannot refresh any page besides the main page without getting a 404 error

Our app uses the [History API](https://developer.mozilla.org/en-US/docs/Web/API/History_API) to emulate going back and forward in the browser. The urls that History API generates are not real urls and thus when you refresh the page, the browser is expecting the server to return some data that does not actually exist. To do this, code on the backend would need to be made, which is outside of the scope of this project.

## 🤝 Credits

This project was created by [Charles Kwang](https://github.com/KojinKuro), [Ben Wehrend](https://github.com/BenWehrend), and [Laurel Bonal](https://github.com/laurelbonal)

## 📜 License

This project is licensed under the MIT License - see the [LICENSE.md](./LICENSE.md) for more details.
