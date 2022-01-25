import Experiment from '..';

declare global {
  interface Window {
    Experiment: Experiment;
    gorilla: Gorilla;
    jsPsych: jsPsych;
  }
}
