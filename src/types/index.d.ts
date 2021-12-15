/* eslint-disable camelcase */
declare type Configuration = {
  // General configuration properties
  name: string,
  studyName: string,
  manipulations: {
    [k: string]: number | string,
  },
  stimuli: {
    [k: string]: string,
  },
  seed: number,
  allowParticipantContact: boolean,
  contact: string,

  // Optional initial state configuration
  state?: any,
};

// Generic jsPsych parameters used to instantiate the
// jsPsych instance
declare type jsPsychParameters = {
  // Timeline
  timeline: any[],

  // 'on_finish' callback
  on_finish: () => void;

  // Other generic properties
  [x: string]: any,
};

declare type jsPsych = {
  // Functions
  init(paramters: jsPsychParameters): void;
  endExperiment(message: string): void;

  // Data object
  data: any;
};

// Gorilla type
declare type Gorilla = {
  ready(func: () => void): void,
  manipulation(key: string): any;
  stimuliURL(stimuli: string): string,
  metric(data: any): void,
  finish(): void,
};

// Declare a global jsPsych instance
declare const jsPsych: jsPsych;
