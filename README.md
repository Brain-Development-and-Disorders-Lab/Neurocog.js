# Neurocog.js

![Neurocog.js Icon](./icon.png)

> A jsPsych Extension enabling integration with the Gorilla online behavioral experiment platform, designed to extend your jsPsych experiment with new features and capabilities.

🚨 Neurocog.js is now a **jsPsych Extension**! This means that Neurocog.js v0.4.0+ is only compatible with jsPsych v7.0+. For earlier jsPsych versions, please use Neurocog.js [v0.3.9](https://github.com/Brain-Development-and-Disorders-Lab/Neurocog.js/releases/tag/v0.3.9) or earlier. 🚨

## Features

### [Gorilla](https://gorilla.sc) integration

Facilitates interaction with parts of the Gorilla API. Load and access stimuli, access manipulations, and update stored data while maintaining the same codebase online and offline. The wrapper library detects what context the experiment is running in and makes API calls accordingly.

### State management

A global state is maintained outside of the jsPsych instance. While not an advisable for experiment-wide data storage, a state system can be used to direct task logic and add an element of dynamic behavior. Additionally, it could function as temporary data storage.

### Error handling & task shutdown

By listening for errors in the browser, this library provides graceful error handling and alerts participants before ending the experiment. This prevents online experiments from hanging or resulting in the complete loss of participant data.

### Centralised seeded random number generator

A seeded RNG is provided using the [D3.js](https://d3js.org) library.

## Installation

### jsPsych v7.0+

```Shell
npm install neurocog
```

```Shell
yarn add neurocog
```

Once installed, refer to the jsPsych guide on [Extension usage](https://www.jspsych.org/7.3/overview/extensions/) for instructions to enable the Neurocog.js extension within your existing experiment using jsPsych v7.0+. Refer to **Configuration** below for further information regaring the expected parameters (`params`).

### Up to jsPsych v7.0

```Shell
npm install neurocog@0.3.9
```

```Shell
yarn add neurocog@0.3.9
```

## Configuration

Neurocog.js expects a number of parameters (`params`) when being initialized. There are also optional parameters (parameters in **bold** are required):

| Name                        | Type          | Description                                                                                                                                                                                                                                                     |
| --------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **name**                    | `string`      | A human-readable name for the experiment such as `"Brain Game"`                                                                                                                                                                                                 |
| **studyName**               | `string`      | A machine-readable name for the experiment plugin such as `"brain-game"`. No whitespace is permitted.                                                                                                                                                           |
| **manipulations**           | `key : value` | A collection of key-value pairs that represent the manipulations configured in Gorilla. The key must be a string, and the value can be a string, boolean, or number. _While required, it can be empty._                                                         |
| **resources**                 | `key : value` | A collection of key-value pairs that represent resources used in the experiment. The key can be used as a unique identifier for accessing the resource in the source code. The value is the relative path to the actual resource. _While required, it can be empty._ |
| **stimuli**                 | `key : value` | A collection of key-value pairs that represent the stimuli used in the experiment. The key can be used as a unique identifier for accessing the stimulus in the source code. The value is the relative path to the actual stimulus. _While required, it can be empty._ |
| **allowParticipantContact** | `boolean`     | Whether or not to show an email address for participants to contact in the case of an error.                                                                                                                                                                    |
| **contact**                 | `string`      | The contact email address for the experiment.                                                                                                                                                                                                                   |
| **seed**                    | `number`      | A float to act as the seed for the RNG.                                                                                                                                                                                                                         |
| state                       | `key : value` | State initialisation parameters. This object is digested as the initial state and is accessible during the experiment using the same keys. _While not required, it must be at least defined if state functionality is to be used._                              |
| logging                     | `LogLevel`    | Set the logging level of the `consola` logging utility.                                                                                                                                                                                                         |

To utilize the Neurocog.js functionality in timeline trials, ensure that the trial object contains the `extensions` parameter containing the type `NeurocogExtension`, shown below:

```JavaScript
var timelineNode = {
  ...
  extensions: [
    {
      type: NeurocogExtension,
    }
  ],
  ...
}
```

Check out the experiment in the `example/` directory for a simple example.

### [Gorilla](https://gorilla.sc) integration: Manipulations

The manipulations specified in the initialization parameters should have the same name as the manipluations defined online on Gorilla. Neurocog.js will update the values of the configured manipulations with the actual manipulations defined by Gorilla.

Configuring Manipulations:

```JavaScript
const jsPsych = initJsPsych({
  // ...
  extensions: [
    {
      type: NeurocogExtension,
      params: {
        // ...
        manipulations: {
          variableA: 1,
        },
        // ...
      }
    }
  ],
  // ...
});
```

Accessing Manipulations:

```JavaScript
const variableA = jsPsych.extensions.Neurocog.getManipulation("variableA");
console.log(variableA); // 1
```

### [Gorilla](https://gorilla.sc) integration: Stimuli

To use stimuli in a jsPsych experiment with Neurocog.js, specify a new key-value pairing for each stimulus under the `stimuli` parameter. The key for the stimulus **must** be the exact file name and the value the relative path to the actual stimulus location.

Configuring Stimuli:

```JavaScript
const jsPsych = initJsPsych({
  // ...
  extensions: [
    {
      type: NeurocogExtension,
      params: {
        // ...
        stimuli: {
          'a.jpg': 'img/a.jpg',
          // ...
        },
        // ...
      }
    }
  ],
  // ...
});
```

Accessing Stimuli:

```JavaScript
const imageA = jsPsych.extensions.Neurocog.getStimulus('a.jpg');
console.log(imageA); // 'img/a.jpg' or the path to a Gorilla Stimulus
```

### [Gorilla](https://gorilla.sc) integration: Resources

Using a resource in a jsPsych experiment with Neurocog.js is very similar to using a stimulus. Specify a new key-value pairing for each resource under the `resources` parameter. The key for the resource **must** be the exact file name and the value the relative path to the actual resource location.

Configuring Resources:

```JavaScript
const jsPsych = initJsPsych({
  // ...
  extensions: [
    {
      type: NeurocogExtension,
      params: {
        // ...
        resources: {
          'a.jpg': 'img/a.jpg',
          // ...
        },
        // ...
      }
    }
  ],
  // ...
});
```

Accessing Resources:

```JavaScript
const resourceA = jsPsych.extensions.Neurocog.getResource('a.jpg');
console.log(resourceA); // 'img/a.jpg' or the path to a Gorilla Resource
```

### State management: accessing and updating state variables

Configuring State:

```JavaScript
const jsPsych = initJsPsych({
  // ...
  extensions: [
    {
      type: NeurocogExtension,
      params: {
        // ...
        state: {
          counter: 0,
          // ...
        },
        // ...
      }
    }
  ],
  // ...
});
```

The following methods can be used for interacting with the experiment state throughout the experiment:

| Method                       | Parameters                  | Description                              |
| ---------------------------- | --------------------------- | ---------------------------------------- |
| `getState(key)`        | `key: string`               | Get the value of a global state variable |
| `setState(key, value)` | `key: string`, `value: any` | Set the value of a global state variable |

## Developer commands

If you would like to contribute to Neurocog.js, these commands will be useful for you. To create a production-ready build of Neurocog.js, run the following command:

```Shell
yarn build
```

To run all unit tests and other tests for Neurocog, use the following command:

```Shell
yarn test
```

To remove outdated builds or temporary files, use the following command:

```Shell
yarn clean
```
