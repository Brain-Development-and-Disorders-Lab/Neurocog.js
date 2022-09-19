# Neurocog.js

<img src="https://raw.githubusercontent.com/Brain-Development-and-Disorders-Lab/Neurocog.js/main/icon.png" alt="Neurocog.js icon" width="200" style="display: block; margin-left: auto; margin-right: auto;"/>

A utility wrapper library extending the functionality of jsPsych-based cognitive tasks and enabling multiplatform operation, designed to extend your jsPsych experiment with new features and capabilities.

## Features

### [Gorilla](https://gorilla.sc) integration

Facilitates interaction with parts of the Gorilla API. Load and access stimuli, access manipulations, and update stored data while maintaining the same codebase online and offline. The wrapper library detects what context the experiment is running in and makes API calls accordingly.

### State management

A global state is maintained outside of the jsPsych instace. While not an advisable for experiment-wide data storage, a state system can be used to direct task logic and add an element of dynamic behavior. Additionally, it could function as temporary data storage.

### Error handling & task shutdown

By listening for errors in the browser, this library provides graceful error handling and alerts participants before ending the experiment. This prevents online experiments from hanging or resulting in the complete loss of participant data.

### Centralised seeded random number generator

A seeded RNG is provided using the [D3.js](https://d3js.org) library.

## Installation

### Installing via a package manager

Install the library using NPM or Yarn:

```Shell
npm install neurocog
```

```Shell
yarn add neurocog
```

The library is contained in the `Experiment` class. To get started, import it at the top of the file containing a `jsPsych.init(...)` function call.

```JavaScript
import { Experiment } from "neurocog";
```

### Importing via a `<script>` tag in an HTML file

Download the script locally and import it via a `<script>` tag in the `<head>` of the HTML page.

```HTML
<script src="<path>/neurocog.js"></script>
```

Obtain the script from a CDN and import it via a `<script>` tag in the `<head>` of the HTML page.

```html
<script src="https://unpkg.com/neurocog@0.3.1/dist/index.js"></script>
```

## Usage

Before instantiating the `Experiment` instance, create an experiment configuration object. The following parameters are recognized (parameters in **bold** are required):

| Name                        | Type          | Description                                                                                                                                                                                                                                                     |
| --------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **name**                    | `string`      | A human-readable name for the experiment such as `"Brain Game"`                                                                                                                                                                                                 |
| **studyName**               | `string`      | A machine-readable name for the experiment plugin such as `"brain-game"`. No whitespace is permitted.                                                                                                                                                           |
| **manipulations**           | `key : value` | A collection of key-value pairs that represent the manipulations configured in Gorilla. The key must be a string, and the value can be a string, boolean, or number. _While required, it can be empty._                                                         |
| **stimuli**                 | `key : value` | A collection of key-value pairs that represent the images used in the experiment. The key can be used as a unique identifier for accessing the image in the source code. The value is the relative path to the actual image. _While required, it can be empty._ |
| **allowParticipantContact** | `boolean`     | Whether or not to show an email address for participants to contact in the case of an error.                                                                                                                                                                    |
| **contact**                 | `string`      | The contact email address for the experiment.                                                                                                                                                                                                                   |
| **seed**                    | `number`      | A float to act as the seed for the RNG.                                                                                                                                                                                                                         |
| state                       | `key : value` | State initialisation parameters. This object is digested as the initial state and is accessible during the experiment using the same keys. _While not required, it must be at least defined if state functionality is to be used._                              |
| logging                     | `LogLevel`    | Set the logging level of the `consola` logging utility.                                                                                                                                                                                                         |

An example configuration object can be seen in the `example/config.js` file.

Once the configuration has been created, instantiate the `Experiment` instance:

```JavaScript
// File: experiment-code.js
const configuration = {
  // Configuration data
};

const experiment = new Experiment(configuration);
```

After the timeline and experiment has been setup, instead of using `jsPsych.init(...)`, use `experiment.start(...)` with jsPsych initialisation parameters. All jsPsych parameters are supported:

```JavaScript
// File: experiment-code.js
experiment.start({
  timeline: [...],
  // Other jsPsych parameters
});
```

Finally, ensure that the script containing the `experiment.start()` function is imported with the `defer` parameter set in its `<script>` tag, shown below:

```HTML
<script src="<location of>/experiment-code.js" defer></script>
```

When running the experiment on Gorilla, this will look slightly different, since only the `<head>` component is editable. On Gorilla, edit the `<head>` component after uploading the experiment code as a `Resource`:

```HTML
<script src="{{ resource 'experiment-code.js' }}" defer></script>
```

If the script is not imported correctly, it will not operate properly on Gorilla, and will display a warning when operating offline.

Check out the experiment in the `example/` directory for a more in-depth example.

### [Gorilla](https://gorilla.sc) integration: Manipulations

The manipulations specified in the `Experiment` configuration should have the same name as the manipluations defined online on Gorilla. The library, if operating online on the Gorilla platform, will update the values of the configured manipulations with the actual manipulations defined by Gorilla.

To access manipulations:

```JavaScript
// File: configuration.js
export const configuration = {
  // ...
  manipulations: {
    variableA: 1,
    variableB: 2,
  },
  // ...
};
```

```JavaScript
// File: experiment-code.js
import { configuration } from "./configuration";

const variableA = configuration.manipulations.variableA; // 1
const variableB = configuration.manipulations.variableB; // 2
```

### [Gorilla](https://gorilla.sc) integration: Stimuli

Neurocog.js supports a key-value system in the configuration file when defining relative paths to stimuli. A `stimuli` keyword is expected in the configuration file, and represents the object containing these key-value pairings.

To use stimuli in a jsPsych experiment with Neurocog.js, specify a key for accessing the image alongside a value containing the relative path to the actual image location:

```JavaScript
// File: configuration.js
export const configuration = {
  // ...
  stimuli: {
    'a.jpg' : 'img/a_1.jpg',
    'b.jpg' : 'img/b_1.jpg',
    // ...
  },
  // ...
}
```

The above example references two images stored in an `img/` directory: `a_1.jpg` and `b_2.jpg`. Since these images have been assigned keys `a.jpg` and `b.jpg` respectively, they can be referenced throughout the experiment source code using these keys.

Neurocog.js ultimately stores images in a 'stimuli collection', which can be accessed safely using the following code snippet:

```JavaScript
// File: experiment-code.js
// Get 'img/a_1.jpg'
const imageA = experiment.getStimuli().getImage('a.jpg');

// Get 'img/b_2.jpg'
const imageB = experiment.getStimuli().getImage('b.jpg');
```

Neurocog detects the presence of the Gorilla platform, and it will automatically re-map the stimuli paths to the corresponding Gorilla API function call.

### State management: accessing and updating state variables

The following methods can be used for interacting with the experiment state throughout the experiment:

| Method                       | Parameters                  | Description                              |
| ---------------------------- | --------------------------- | ---------------------------------------- |
| `getState()`                 | none                        | Get the global state                     |
| `getState().get(key)`        | `key: string`               | Get the value of a global state variable |
| `getState().set(key, value)` | `key: string`, `value: any` | Set the value of a global state variable |

## Developer commands

If you would like to contribute or experiment with the library, these commands will be useful for you. To create a production-ready build of the library, run the following command:

```Shell
yarn build
```

To run all unit tests and other tests for Neurocog, use the following command:

```Shell
yarn test
```

[Prettier](https://prettier.io) is used to lint Neurocog, run the following command to run Prettier over the repository:

```Shell
yarn lint
```

To remove outdated builds or temporary files, use the following command:

```Shell
yarn clean
```
