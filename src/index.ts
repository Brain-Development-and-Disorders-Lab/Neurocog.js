import { JsPsych, JsPsychExtension, JsPsychExtensionInfo } from "jspsych";

// Utility functions
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

  // Collection of stimuli
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

  // Class parameters
  private isGorilla: boolean;

  constructor(private jsPsych: JsPsych) {
    this.jsPsych = jsPsych;
    this.isGorilla = false;
  };

  initialize = ({}: InitializeParameters): Promise<void> => {
    return new Promise((resolve, _reject) => {
      // Determine environment (Gorilla or otherwise)
      if (_.isEqual(this.is_gorilla(), true)) {
        this.isGorilla = true;
        consola.info("Gorilla platform detected");
      } else {
        consola.info("Gorilla platform not detected");
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

  /**
   * Utility function to check if the Gorilla API is accessible in
   * the current browser context
   * @return {boolean}
   */
  private is_gorilla(): boolean {
    return "gorilla" in window;
  }
}

export default NeurocogExtension;
