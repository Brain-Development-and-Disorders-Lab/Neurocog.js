// Experiment library
import {Experiment} from '../built/experiment.bundle';

// Configuration to be used
import {config} from './config';

// Import the jsPsych plugins to be used
import 'jspsych/plugins/jspsych-instructions';

const experiment = new Experiment(config);

const timeline = [{
  type: 'instructions',
  pages: [
    `<h1>First page!</h1>`,
    `<h1>Second page!</h1>`,
  ],
  show_clickable_nav: true,
}];

// Start the experiment with the jsPsych properties
experiment.start({
  timeline: timeline,
  show_progress_bar: true,
  show_preload_progress_bar: true,
});
