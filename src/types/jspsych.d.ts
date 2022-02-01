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
