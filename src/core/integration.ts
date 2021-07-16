/**
 * THIS FILE SHOULD NOT BE MODIFIED.
 *
 * The purpose of this file is to establish variables
 * and imports required.
 */

// Configure jsPsych window variable to make TypeScript happy
import 'jspsych/jspsych';

// Import jQuery for Gorilla integration
import * as $ from 'jquery';

// Import the plugin before adding it to the timeline
import './plugin';

// Import user-defined configuration
import {config} from '../config/config';

// Import and configure seedrandom
import * as seedrandom from 'seedrandom';
window.Math.random = seedrandom(config.seed);

/**
 * Initialisation function
 * @param {any[]} timeline jsPsych timeline
 */
export function init(timeline: any[]) {
  // Initialise jsPsych and Gorilla (if required)
  if (config.target === 'gorilla') {
    // Wait for the entire page to be loaded before initialising
    // jsPsych and Gorilla
    window.onload = () => {
      // Once all modules are loaded into the window,
      // access Gorilla API and jsPsych library
      const _gorilla = window['gorilla'];
      const _jsPsych = window['jsPsych'];

      // Make sure Gorilla and jsPsych are loaded
      if (_gorilla && _jsPsych) {
        // Require any jsPsych plugins, so that they are
        // loaded here
        require('jspsych/plugins/jspsych-instructions');
        _gorilla.ready(function() {
          _jsPsych.init({
            display_element: $('#gorilla')[0],
            timeline: timeline,
            on_data_update: function(data) {
              _gorilla.metric(data);
            },
            on_finish: function() {
              _gorilla.finish();
            },
            show_progress_bar: true,
            show_preload_progress_bar: true,
          });
        });
      } else {
        console.error(`Fatal: Gorilla or jsPsych not loaded.`);
      }
    };
  } else {
    // Once all modules are loaded into the window,
    // access jsPsych library
    const _jsPsych = window['jsPsych'];

    // Make sure jsPsych is loaded
    if (_jsPsych) {
      // Require any jsPsych plugins, so that they are
      // loaded here
      require('jspsych/plugins/jspsych-instructions');
      _jsPsych.init({
        timeline: timeline,
        on_finish: function() {
          _jsPsych.data.get().localSave(`csv`, `intentions_${Date.now()}.csv`);
        },
        show_progress_bar: true,
        show_preload_progress_bar: true,
      });
    } else {
      console.error(`Fatal: jsPsych not loaded.`);
    }
  }
}
