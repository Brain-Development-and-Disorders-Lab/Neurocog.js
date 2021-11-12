import {Experiment} from '../built/experiment.bundle';
import {config} from './config';

const experiment = new Experiment(config);

console.debug(experiment);
