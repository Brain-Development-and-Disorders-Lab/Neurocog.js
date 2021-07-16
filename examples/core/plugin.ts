// Import jsPsych
import 'jspsych/jspsych';

// Make TypeScript happy by declaring jsPsych
declare const jsPsych: any;

// Stylesheets
import 'jspsych/css/jspsych.css';

// Core modules
import {config} from '../../src/config/config';
import {displayScreen, SCREENS} from './screens';

jsPsych.plugins['example-plugin'] = (function() {
  const plugin = {
    info: {},
    trial: function(displayElement, trial) {},
  };

  // Define the information about the plugin as well as trial
  // parameters
  plugin.info = {
    name: config.name,
    parameters: {},
  };

  plugin.trial = function(displayElement, trial) {
    displayScreen(SCREENS.EYETRACKING, displayElement, {});
    // jsPsych.finishTrial();
  };

  return plugin;
})();
