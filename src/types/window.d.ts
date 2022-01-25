import Experiment from '..';

declare global {
  interface Window {
    Experiment: Experiment;
    Gorilla: Gorilla;
    jsPsych: jsPsych;
  }
}
