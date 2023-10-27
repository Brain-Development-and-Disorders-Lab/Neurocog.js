# Neurocog.js

![Neurocog.js Icon](./icon.png)

> A jsPsych Extension enabling integration with the Gorilla online behavioral experiment platform, designed to extend your jsPsych experiment with new features and capabilities.

🚨 Neurocog.js is now a **jsPsych Extension**! This means that Neurocog.js v0.4.0+ is only compatible with jsPsych v7.0+. For earlier jsPsych versions, please use Neurocog.js [v0.3.9](https://github.com/Brain-Development-and-Disorders-Lab/Neurocog.js/releases/tag/v0.3.9) or earlier. 🚨

---

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

---

## Configuration

Neurocog.js expects a number of parameters (`params`) when being initialized. There are also optional parameters (parameters in **bold** are required):

| Name                        | Type          | Description                                                                                                                                                                                                                                                     |
| --------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **name**                    | `string`      | A human-readable name for the experiment such as `"Brain Game"`                                                                                                                                                                                                 |
| **studyName**               | `string`      | A machine-readable name for the experiment plugin such as `"brain-game"`. No whitespace is permitted.                                                                                                                                                           |
| **allowParticipantContact** | `boolean`     | Whether or not to show an email address for participants to contact in the case of an error.                                                                                                                                                                    |
| **contact**                 | `string`      | The contact email address for the experiment.                                                                                                                                                                                                                   |
| **seed**                    | `number`      | A float to act as the seed for the RNG.                                                                                                                                                                                                                         |
| state                       | `key : value` | State initialisation parameters. This object is digested as the initial state and is accessible during the experiment using the same keys. _While not required, it must be at least defined if state functionality is to be used._                              |
| logging                     | `LogLevel`    | Set the logging level of the `consola` logging utility.                                                                                                                                                                                                         |

⚠️ **Breaking Change (as of v1.1.0):** Multiple parameters have been removed and are no longer utilized. This has also been reflected in a number of functions that have been deprecated. This table describes the parameters that have been removed in v1.1.0.

| Name                        | Type          | Description                                                                                                                                                                                                                                                     |
| --------------------------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| ~~manipulations~~           | `key : value` | A collection of key-value pairs that represent the manipulations configured in Gorilla. The key must be a string, and the value can be a string, boolean, or number. _While required, it can be empty._                                                         |
| ~~resources~~                 | `key : value` | A collection of key-value pairs that represent resources used in the experiment. The key can be used as a unique identifier for accessing the resource in the source code. The value is the relative path to the actual resource. _While required, it can be empty._ |
| ~~stimuli~~                 | `key : value` | A collection of key-value pairs that represent the stimuli used in the experiment. The key can be used as a unique identifier for accessing the stimulus in the source code. The value is the relative path to the actual stimulus. _While required, it can be empty._ |

## Integration

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

### [Gorilla](https://gorilla.sc): Manipulations

⚠️ **Breaking Change (as of v1.1.0):** Manipulations are no longer required to be specified in the Neurocog parameters. Now the `getManipulation` function takes two arguments, the name, and a default value. If running locally, the default value will always be returned. If running on Gorilla, the Manipulation value specified on Gorilla will be returned.

Accessing Manipulations:

```JavaScript
const variableA = jsPsych.extensions.Neurocog.getManipulation("variableA", 2);
console.log(variableA); // The value of the manipulation if specified on Gorilla, otherwise 2
```

### [Gorilla](https://gorilla.sc): Stimuli

⚠️ **Breaking Change (as of v1.1.0):** When running an experiment locally, all Stimuli must be located in a _stimuli_ directory alongside the file initializing jsPsych. Stimuli are no longer required to be specified in the Neurocog parameters.

The key for a Stimulus **must** be the exact file name.

Accessing Stimuli:

```JavaScript
const imageSrc = jsPsych.extensions.Neurocog.getStimulus('stimulus.jpg');
console.log(imageA); // 'stimuli/stimulus.jpg' locally or the path to a Gorilla Stimulus
```

### [Gorilla](https://gorilla.sc): Resources

⚠️ **Breaking Change (as of v1.1.0):** When running an experiment locally, all Resources must be located in a _resources_ directory alongside the file initializing jsPsych. Resources are no longer required to be specified in the Neurocog parameters.

The key for a Resource **must** be the exact file name.

Accessing Resources:

```JavaScript
const resourceSrc = jsPsych.extensions.Neurocog.getResource('resource.jpg');
console.log(resourceSrc); // 'resource/resource.jpg' or the path to a Gorilla Resource
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

---

![License](https://i.creativecommons.org/l/by-nc-sa/4.0/88x31.png)

This work is licensed under a [Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License](http://creativecommons.org/licenses/by-nc-sa/4.0/).
