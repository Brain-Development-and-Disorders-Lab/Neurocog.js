import {Init} from './Init';

export type jsPsych = {
  // Init function
  init(paramters: Init): void;

  // Data object
  data: any;
};
