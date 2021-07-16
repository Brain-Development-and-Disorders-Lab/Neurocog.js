// Import jsPsych
import 'jspsych/jspsych';

// Make TypeScript happy by declaring jsPsych
declare const jsPsych: any;

// Stylesheets
import 'jspsych/css/jspsych.css';
import '../css/styles.css';

// Core modules
import {config} from '../config/config';

jsPsych.plugins['plugin-name'] = (function() {
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
    jsPsych.finishTrial();
  };

  return plugin;
})();
