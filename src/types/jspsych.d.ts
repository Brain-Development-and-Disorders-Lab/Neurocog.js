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

declare type jsPsychParameters = {
  // Timeline
  timeline: any[];

  // 'on_finish' callback
  on_finish: () => void;

  // Other generic properties
  [x: string]: any;
};
