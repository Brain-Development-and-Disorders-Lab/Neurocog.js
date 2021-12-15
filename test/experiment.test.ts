import {Experiment} from '../src/experiment';
import {PLATFORMS} from '../src/constants';

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

let configuration = DEFAULT_CONFIGURATION;

afterAll(() => {
  // Reset the configuration
  configuration = DEFAULT_CONFIGURATION;
});

test('(jsPsych) create new instance', () => {
  const experiment = new Experiment(configuration);

  // Check that jsPsych has been detected
  expect(experiment.getPlatform()).toEqual(PLATFORMS.JSPSYCH);
});

test('(jsPsych & Gorilla) create new instance', () => {
  // Set the Window to contain a mock Gorilla instance
  window[PLATFORMS.GORILLA] = {};

  const experiment = new Experiment(configuration);

  // Check that Gorilla has been detected
  expect(experiment.getPlatform()).toEqual(PLATFORMS.GORILLA);
});
