# Neurocog.js

<img src="icon.png" alt="Neurocog.js icon" width="200"/>

A utility wrapper library extending the functionality of jsPsych-based cognitive tasks and enabling multiplatform operation.

> `Neurocog.js` was bootstrapped using the TSDX tool, a utility for generating libraries using TypeScript.

## Features

### Gorilla API integration

Facilitates interaction with parts of the Gorilla API. Load and access stimuli, read and modify manipulations, and update stored data while maintaining the same codebase online and offline. The wrapper library detects what context the experiment is running in and makes API calls accordingly.

### Global experiment state

A global state is maintained by the `Experiment` and is bound to the `window` interface. Using a key-value collection, the global state is instantiated when the `Experiment` instance is created, and it can be updated and added to over the entire duration of the experiment.

| Method | Parameters | Description |
| ------ | ---------- | ----------- |
| getGlobalState | none | Get the global state |
| getGlobalStateValue | `key: string` | Get the value of a global state variable |
| setGlobalStateValue | `key: string`, `value: any` | Set the value of a global state variable |

### Graceful error handling

By listening for errors in the browser, the `Experiment` class provides graceful error handling by providing an alert to participants before ending the experiment. This prevents online experiments hanging and complete loss of participant data.

### Utilties

A seeded RNG is accessed via the `random()` method. The `consola` logging library is integrated and used throughout the library. Retrieve the current platform being used via the `getPlatform()` method.

## Usage

To get started with the library, import it at the top of the file containing your `jsPsych.init(...)` function call:

```js
import { Experiment } from 'neurocog';
```

## Configuration

Before instantiating the `Experiment` instance, create an experiment configuration object. A set of properties are required in a configuration object:

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | `string` | A plain-text name for the experiment such as `"Brain Game"` |
| studyName | `string` | A plain-text name for the experiment plugin such as `"brain-game"`. No whitespace is permitted. |
| manipulations | `key : value` | A collection of key-value pairs that represent the manipulations configured in Gorilla. The key must be a string, and the value can be a string, boolean, or number. |
| stimuli | `key : value` | A collection of key-value pairs that represent the images used in the experiment. The key can be used as a unique identifier for accessing the image in the source code. The value is the relative path to the actual image. |
| allowParticipantContact | `boolean` | Whether or not to show an email address for participants to contact in the case of an error. |
| contact | `string` | The contact email address for the experiment. |
| seed | `number` | A float to act as the seed for the RNG. |

An example configuration object can be seen in the `example/` directory.

Once the configuration has been created, instantiate the `Experiment` instance:

```js
const config = {
  // Configuration data
};

const experiment = new Experiment(config);
```

After the timeline and experiment has been setup, instead of calling `jsPsych.init(...)`, call `experiment.start(...)` with the jsPsych initialisation parameters:

```js
const config = {
  // Configuration data
};

const experiment = new Experiment(config);

// Create and populate the timeline

// Start the experiment with the jsPsych properties
experiment.start({
  timeline: [...],
  // Other jsPsych parameters
});
```

Check out the experiment in the `example/` directory for a more in-depth example.

## Developer Commands

If you would like to contribute or experiment with the library, these commands will be useful for you.

To start development of the library, run the following command:

```bash
yarn start
```

To create a production-ready build of the library, run the following command:

```bash
yarn build
```

To run the example project showing how the library is to be used (source code is located in the `example` folder), run the following commmand:

```bash
yarn example
```
