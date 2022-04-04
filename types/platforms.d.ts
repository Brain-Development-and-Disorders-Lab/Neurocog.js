// Gorilla type
declare type Gorilla = {
  ready(func: () => void): void;
  manipulation(key: string): any;
  stimuliURL(stimuli: string): string;
  metric(data: any): void;
  finish(): void;
};

// jsPsych type
declare type jsPsych = {
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
declare type jsPsychParameters = {
  // Timeline
  timeline: any[];

  // 'on_finish' callback
  on_finish: () => void;

  // Other generic properties
  [x: string]: any;
};
