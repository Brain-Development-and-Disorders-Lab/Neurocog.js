import {Experiment} from '../src/experiment';
import {PLATFORMS} from '../src/constants';

// Default configuration to use for all Experiment tests
const DEFAULT_CONFIGURATION = {
  // -------------------- Information --------------------
  name: 'Test',
  studyName: 'Study',

  // -------------------- Participants --------------------
  allowParticipantContact: false,
  contact: '',

  // -------------------- Manipulations --------------------
  manipulations: {
    variableOne: 0,
  },

  // -------------------- Stimuli --------------------
  stimuli: {},

  // -------------------- Other --------------------
  // Seed for RNG must be in [0, 1)
  seed: 0.1234,
};

// Instantiate the default configuration
let configuration = DEFAULT_CONFIGURATION;

beforeEach(() => {
  // Reset the window object
  delete window[PLATFORMS.GORILLA];

  // Reset the configuration
  configuration = DEFAULT_CONFIGURATION;
});

test('(jsPsych) create new instance', () => {
  const experiment = new Experiment(configuration);

  // Check that jsPsych has been detected
  expect(experiment.getPlatform()).toEqual(PLATFORMS.JSPSYCH);
});

test('(jsPsych & Gorilla) create new instance', () => {
  // Set the window to contain a mock Gorilla instance
  window[PLATFORMS.GORILLA] = {};

  const experiment = new Experiment(configuration);

  // Check that Gorilla has been detected
  expect(experiment.getPlatform()).toEqual(PLATFORMS.GORILLA);
});

test('(jsPsych) check configuration', () => {
  const experiment = new Experiment(configuration);

  // Check that the configuration has been preserved
  expect(experiment.getConfiguration()).toEqual(DEFAULT_CONFIGURATION);
});

test('(jsPsych) default state', () => {
  const experiment = new Experiment(configuration);

  // Check that the state is unspecified
  expect(experiment.getGlobalState()).toBeUndefined();
});

test('(jsPsych) state created', () => {
  // Modify the configuration to include a basic state
  const state = {
    variableOne: 1,
  };
  configuration['state'] = state;

  const experiment = new Experiment(configuration);

  // Check that the state is equal to the basic state
  expect(experiment.getGlobalState()).toEqual(state);
});

test('(jsPsych) state value exists', () => {
  // Modify the configuration to include a basic state
  const state = {
    variableOne: 1,
  };
  configuration['state'] = state;

  const experiment = new Experiment(configuration);

  // Check that the state value has been set
  expect(experiment.getGlobalStateValue('variableOne')).toEqual(1);
});

test('(jsPsych) state value does not exist', () => {
  // Modify the configuration to include a basic state
  const state = {
    variableOne: 1,
  };
  configuration['state'] = state;

  const experiment = new Experiment(configuration);

  // Check that the state value doesn't exist
  expect(experiment.getGlobalStateValue('variableTwo')).toBeNull();
});

test('(jsPsych) state value can be updated', () => {
  // Modify the configuration to include a basic state
  const state = {
    variableOne: 1,
  };
  configuration['state'] = state;

  const experiment = new Experiment(configuration);

  // Update the state value
  experiment.setGlobalStateValue('variableOne', 2);

  // Check that the state value has been updated
  expect(experiment.getGlobalStateValue('variableOne')).toEqual(2);
});

test('(jsPsych) state is reset', () => {
  // Modify the configuration to include a basic state
  const state = {
    variableOne: 1,
  };
  configuration['state'] = state;

  const experiment = new Experiment(configuration);

  // Modify the state
  experiment.setGlobalStateValue('variableOne', 2);

  // Reset the state to the original state
  experiment.resetState();

  // Check that the state value doesn't exist
  expect(experiment.getGlobalState()).toEqual(state);
});

test('(jsPsych) generate random number', () => {
  const experiment = new Experiment(configuration);

  // Check that a number is generated
  expect(typeof experiment.random()).toEqual('number');
});
