# Cross-Platform jsPsych Wrapper

A wrapper library that allows a jsPsych codebase to be tested and run on local and online platforms without requiring multiple versions or integrations.

## Features

### Extensible

Using TypeScript alongside tools such as Webpack allows the library to be extended and built upon easily. Other libraries or frameworks such as React can be easily added to the wrapper library to be included in the jsPsych codebase.

### Designed around jsPsych 6.3 and Gorilla

The wrapper library was designed to integrate with one of the largest and most established online behavioural experiment libraries for JavaScript.

## Commands

### Developer commands

`yarn dev`: Run a webpack HMR-compatible (hot module reload) development server to rebuild the library on changes.

`yarn build`: Create a development build of the library.

`yarn style`: Pipe all the source code through ESLint to check for any style violations.

`yarn test`: Run the test suite.

### General commands

`yarn clean`: Remove any generatedbuild artefacts.

`yarn docs`: Generate the library documentation.

`yarn example`: Run the example jsPsych project from the _example/_ directory. Open [localhost:1234](http://localhost:1234) to view the project in-browser.
