// jsPsych imports
import { JsPsych, JsPsychExtension, JsPsychExtensionInfo } from "jspsych";

// Utility functions and libraries
import { isPlatform } from "./util";
import consola from "consola";
import _ from "lodash";

/**
 * Interface to describe initialization parameters, configuring
 * Neurocog
 */
interface InitializeParameters {
  name: string;
  studyName: string;

  // Gorilla manipulations
  manipulations: {
    [k: string]: number | string | boolean | any;
  };

  // Gorilla resources
  resources: {
    [k: string]: string;
  };

  // Gorilla stimuli
  stimuli: {
    [k: string]: string;
  };

  // Error-handling contact
  allowParticipantContact: boolean;
  contact: string;

  // Optional initial state configuration
  state?: any;

  // Optional logging level
  logging?: any;

  // Seed for RNG
  seed: number;
};

interface OnStartParameters {}

interface OnLoadParameters {}

interface OnFinishParameters {}

/**
 * **Neurocog Extension**
 *
 * Integrate jsPsych experiments with the Gorilla online behavioral
 * experiment platform
 *
 * @author Henry Burgess
 * @see {@link https://github.com/henry-burgess/Neurocog.js Repository}
 */
class NeurocogExtension implements JsPsychExtension {
  static info: JsPsychExtensionInfo = {
    name: "neurocog",
  };

  // Toggle to indicate if task is operating online
  private useAPI: boolean;

  constructor(private jsPsych: JsPsych) {
    this.jsPsych = jsPsych;
    this.useAPI = false;
  };

  initialize = ({}: InitializeParameters): Promise<void> => {
    return new Promise((resolve, _reject) => {
      // Determine environment (API or otherwise)
      if (isPlatform()) {
        this.useAPI = true;
        consola.info("API detected");
      } else {
        consola.info("API not detected");
      }
      resolve();
    });
  };

  on_start = ({}: OnStartParameters): void => {};

  on_load = ({}: OnLoadParameters): void => {};

  on_finish = ({}: OnFinishParameters): { [key: string]: any } => {
    return {
      data_property: "data_value",
    };
  };
}

export default NeurocogExtension;
