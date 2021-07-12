// Configuration and data
import {config} from './config';

// Configure jsPsych window variable to make TypeScript happy
import 'jspsych/jspsych';
import * as $ from 'jquery';

// Import the plugin before adding it to the timeline
import './core/plugin';

// Import and configure seedrandom
import * as seedrandom from 'seedrandom';
window.Math.random = seedrandom(config.seed);

// Timeline setup
const timeline = [];

const _image = new Image();
_image.src = 'assets/chess.jpeg';

const instructionsIntroduction = [
  `<h1>${config.name}</h1>` +
  `<span class="instructions-subtitle">` +
    `Please read these instructions carefully.</span>` +
  `<h2>Instructions</h2>` +
  `<img src=${_image.src}></img>` +
  `<p>This is an example set of instructions.</p>`,
];

timeline.push({
  type: 'instructions',
  pages: instructionsIntroduction,
  allow_keys: false,
  show_page_number: true,
  show_clickable_nav: true,
});

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

