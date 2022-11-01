import Neurocog from "../src";

// Extend the Window interface
declare global {
  interface Window {
    Neurocog: Neurocog;
    gorilla: Gorilla;
    jsPsych: jsPsych;
  }
}
