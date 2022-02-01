import Experiment from '..';

// Extend the Window interface
declare global {
  interface Window {
    Experiment: Experiment;
    gorilla: Gorilla;
    jsPsych: jsPsych;
  }
}
