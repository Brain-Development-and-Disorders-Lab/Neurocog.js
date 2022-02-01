# jsPsych Wrapper

Utility library used to enable jsPsych-based experiments to run locally and online while being aware of the runtime context. The library is currently integrated and tested to run on the [Gorilla](https://gorilla.sc) platform.

> `jspsych-wrapper` was bootstrapped using the TSDX tool, a utility for generating TypeScript libraries.

## Commands

To start development of the library, run the following command:

```bash
yarn start
```

To create a production-ready build of the library, run the following command:

```bash
yarn build
```

To run an example project showing how the library is to be used (source code is located in the `example` folder), run the following commmand:

```bash
yarn example
```

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

It is expected that a form of bundling tool or transformation is done on the source code when this tool is used (e.g. Webpack, Parcel.js). To get started with the library, import it at the top of the file containing your `jsPsych.init(...)` function call:

```js
import { Experiment } from 'jspsych-wrapper';
```

### Configuration

Before instantiating the `Experiment` instance, create an experiment configuration object. A set of properties are required in a configuration object:

| Name | Type | Description |
| ---- | ---- | ----------- |
| name | `string` | A plain-text name for the experiment such as `"Two-step Game"` |
| studyName | `string` | A plain-text name for the experiment plugin such as `"twostep-game"`. No whitespace is permitted. |
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

Call the `load()` method, then place all experiment code inside of the callback:

```js
experiment.load().then(() => {
  // Place experiment code in here
  // Create and populate the timeline
});
```

At the end of the callback, after the timeline and experiment has been setup, instead of calling `jsPsych.init(...)`, call `start(...)` with the equivalend jsPsych initialisation parameters:

```js
experiment.load().then(() => {
  // Place experiment code in here
  // Create and populate the timeline

  // Start the experiment with the jsPsych properties
  experiment.start({
    timeline: [...],
    // Other jsPsych parameters
  });
});
```

Check out the experiment in the `example/` directory for a more in-depth example.

### Important

All code that references images, stimuli, or manipulations **must** be called inside or from the file that contains the `load()` function callback.
