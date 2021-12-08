/* eslint-disable camelcase */
declare type Configuration = {
  name: string,
  studyName: string,
  manipulations: {
    [k: string]: number | string,
  },
  stimuli: {
    [k: string]: string,
  },
  seed: string,
  allowParticipantContact: boolean,
  contact: string,
};

// Generic jsPsych parameters used to instantiate the
// jsPsych instance
declare type jsPsychParameters = {
  // Timeline
  timeline: any[],

  // 'on_finish' callback
  on_finish: () => void;

  // Collection of images to preload
  preload_images: string[];

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

// Declare jsPsych instance
declare const jsPsych: jsPsych;
