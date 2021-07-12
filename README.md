# brain-boilerplate 🧠

Project boilerplate for creating online neuropsychological tasks using TypeScript or JavaScript. Now with React!

## Features 🌈

### Targeted builds 🎯

A unique feature of this boilerplate the is the out-of-the-box ability to target the _Gorilla_ platform. Simply upload the bundled `*.js` files from the `dist/` directory to _Gorilla_ as `Resources` and reference them in the `head`, and you're ready to go!

### Support for libraries 📚

No longer bound to vanilla JavaScript, integration with webpack has facilitated bundling of code with all external modules included.

### jsPsych integration 🧠

The boilerplate code is built on jsPsych, taking advantage of an established framework and set of plugins.

## Commands 👨‍💻

`yarn dev`: Run a webpack HMR-compatible (hot module reload) development server to preview the task at [localhost:8080](localhost:8080).

`yarn watch`: Rebuild on changes. The other commands do this automatically anyway.

`yarn build`: Run a development build of the game. Ensure the `target` field of `config.js` is updated to reflect the target of the build.

`yarn style`: Pipe all the source code through ESLint to check for any style violations.

`yarn clean`: Remove any build artefacts.

## Tools 🛠

Uses `yarn` 🧶 to manage dependencies and packages. 

`webpack` 📦 is used as the bundling tool. 

`gulp` 🥤 is used to automate the things that webpack can't do. 

`ESLint` 💅 enforces a consistent style.