// Type to express Gorilla API signatures
// Based on documentation: https://support.gorilla.sc/support/tools/legacy-tools/task-builder-1/gorilla-api#overview
declare type GorillaAPI = {
  ready(callback: () => any): void;
  manipulation(name: string, definition?: any): any;
  stimuliURL(name: string): string;
  resourceURL(resource: string): string;
  metric(data: any, key?: string): void;
  finish(overrideURL?: string): void;
};

declare enum Platforms {
  Gorilla = "gorilla",
  jsPsych = "jsPsych",
  Invalid = "",
}

declare enum Controllers {
  Keyboard = "keyboard",
  Spectrometer = "spectrometer",
  Touch = "touch",
}
