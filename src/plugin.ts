import 'jspsych/jspsych';

// Make TypeScript happy by declaring jsPsych
declare const jsPsych: any;

// Stylesheets
import 'jspsych/css/jspsych.css';
import './css/styles.css';

// Core modules
import {config} from './config';

jsPsych.plugins['plugin-name'] = (function() {
  const plugin = {
    info: {},
    trial: function(displayElement: HTMLElement, trial: any) {},
  };

  plugin.info = {
    name: config.name,
    parameters: {},
  };

  plugin.trial = function(displayElement: HTMLElement, trial: any) {
    jsPsych.finishTrial();
  };

  return plugin;
})();
