import {Experiment} from '../built/experiment.bundle';
import {config} from './config';

const experiment = new Experiment(config);

const timeline = [{
  type: 'instructions',
  pages: [
    `<h1>Hello world!</h1>`,
    `<h1>Hello world!</h1>`,
  ],
  show_clickable_nav: true,
}];

experiment.start({timeline: timeline});

