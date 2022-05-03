// Experiment library
import {Experiment} from '../src';

// Configuration to be used
import {config} from './config';

// Import the jsPsych plugins to be used
import 'jspsych/plugins/jspsych-instructions';

// Create a new Experiment instance
const experiment = new Experiment(config);

// Create and populate the timeline
const timeline = [{
  type: 'instructions',
  pages: [
    `<h1>First page!</h1>`,
    `<h1>Second page!</h1>`,
    `<h1>Third page!</h1><img src="${experiment.getStimuli().getImage('stimulus.jpeg')}" />`,
  ],
  show_clickable_nav: true,
}];

// Start the experiment with the jsPsych properties
experiment.start({
  timeline: timeline,
  show_progress_bar: true,
  show_preload_progress_bar: true,
});
