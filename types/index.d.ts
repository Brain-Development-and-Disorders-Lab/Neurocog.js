// Gorilla type
export type Gorilla = {
  ready(func: () => void): void;
  manipulation(key: string): any;
  stimuliURL(stimuli: string): string;
  resourceURL(resource: string): string;
  metric(data: any): void;
  finish(): void;
};

// jsPsych type
export type jsPsych = {
  // Functions
  init(paramters: jsPsychParameters): void;
  endExperiment(message: string): void;
  finishTrial(data: any): void;

  // Plugin
  plugins: { (): void }[];

  // Data object
  data: any;
};

// jsPsych parameter types
export type jsPsychParameters = {
  // Timeline
  timeline: any[];

  // 'on_finish' callback
  on_finish: () => void;

  // Other generic properties
  [x: string]: any;
};

// General configuration properties
export type Configuration = {
  name: string;
  studyName: string;

  // Gorilla manipulations
  manipulations: {
    [k: string]: number | string | boolean | any;
  };

  // Gorilla resources
  resources: {
    [k: string]: string;
  };

  // Gorilla stimuli
  stimuli: {
    [k: string]: string;
  };

  // Error-handling contact
  allowParticipantContact: boolean;
  contact: string;

  // Optional initial state configuration
  state?: any;

  // Optional logging level
  logging?: any;

  // Seed for RNG
  seed: number;
};
