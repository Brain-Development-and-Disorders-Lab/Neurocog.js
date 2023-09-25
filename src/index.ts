// jsPsych imports
import { JsPsych, JsPsychExtension, JsPsychExtensionInfo } from "jspsych";

// Utility functions and libraries
import { clearTimeouts, clearView, isPlatform } from "./util";
import consola from "consola";
import _ from "lodash";

// Import and configure d3 for random number generation
// using a uniform random distribution
import { randomLcg, randomUniform } from "d3-random";

// API functions
import { Manipulations } from "./api/Manipulations";
import { State } from "./api/State";
import { Resources } from "./api/Resources";
import { Stimuli } from "./api/Stimuli";

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
    name: "Neurocog",
  };

  private parameters: InitializeParameters; // Parameters to configure Neurocog.js

  // Toggles
  private _useAPI: boolean; // Toggle to indicate if task is operating online

  // API and Extension components
  private _gorilla: GorillaAPI; // Gorilla API (defined if available)
  private state: State; // State management
  private stimuli: Stimuli; // Stimuli management
  private _generator: () => number; // Random generator function

  constructor(private jsPsych: JsPsych) {
    this.jsPsych = jsPsych;
    this._useAPI = false;
  };

  /**
   * Params are passed from the extensions parameter in `jsPsych.init`
   * @param {InitializeParameters} params
   * @return {Promise<void>}
   */
  initialize = (params: InitializeParameters): Promise<void> => {
    return new Promise((resolve, _reject) => {
      this.parameters = params;

      // Determine environment (API or otherwise)
      if (isPlatform()) {
        this._useAPI = true;
        this._gorilla = window["gorilla"];
        consola.info("Gorilla API detected");
      }

      // Setup error handling
      window.addEventListener("error", this.invokeError.bind(this));

      // Setup the random number generator
      this._generator = randomUniform.source(randomLcg(this.parameters.seed))(0, 1);

      // Store the initial and global state (if defined)
      if (!_.isUndefined(this.parameters.state)) {
        // Initialise with provided State
        this.state = new State(this.parameters.state);
      } else {
        // Initialise with empty State
        this.state = new State();
      }

      // Configure the experiment Stimuli
      this.stimuli = new Stimuli(this.parameters.stimuli);

      if (this._useAPI) {
        // Bind the Manipulations API component
        Manipulations.link(this.parameters.manipulations);
        Resources.link(this.parameters.resources);

        // Bring the stimuli into the local scope
        // Make sure Gorilla and jsPsych are loaded
        if (!_.isUndefined(this.jsPsych) && isPlatform()) {
          consola.debug(
            `Adding "preload" node to timeline, loading:`,
            Object.values(this.parameters.stimuli)
          );

          const stimuli = this.parameters.stimuli;
          if (!_.isUndefined(stimuli) && Object.values(stimuli).length > 0) {
            consola.debug(`Preloading images:`, Object.values(stimuli));

            // Add a new timeline node to preload the images
            this.jsPsych.addNodeToEndOfTimeline({
              type: "preload",
              auto_preload: true,
              images: Object.values(stimuli),
            });
          }
        } else {
          consola.error(new Error(`Gorilla or jsPsych not loaded`));
        }
      }

      // Resolve now setup is complete
      resolve();
    });
  };

  on_start = (params: OnStartParameters): void => {};

  on_load = (params: OnLoadParameters): void => {};

  on_finish = (params: OnFinishParameters): { [key: string]: any } => {
    this._gorilla.metric(this.jsPsych.getCurrentTrial().data);
    return {};
  };

  private invokeError(error: Error | ErrorEvent): void {
    const target = document.getElementById("jspsych-content");
    clearTimeouts();
    clearView(target);

    // Apply global styling
    document.body.style.fontFamily = "Open Sans";
    document.body.style.textAlign = "center";

    // Container for elements
    const container = document.createElement("div");

    // Heading text
    const heading = document.createElement("h1");
    heading.textContent = "Oh no!";

    // Subheading
    const subheading = document.createElement("h2");
    subheading.textContent = "It looks like an error has occurred.";

    // Container for the error information
    const errorContainer = document.createElement("div");
    errorContainer.style.margin = "20px";

    // 'Error description:' text
    const textIntroduction = document.createElement("p");
    textIntroduction.textContent = "Error description:";

    // Error description
    const description = document.createElement("code");
    description.innerText = error.message;
    description.style.gap = "20rem";
    errorContainer.append(textIntroduction, description);

    // Follow-up instructions
    const textInstructions = document.createElement("p");
    if (this.parameters.allowParticipantContact === true) {
      textInstructions.innerHTML =
        `Please send an email to ` +
        `<a href="mailto:${this.parameters.contact}?` +
        `subject=Error (${this.parameters.studyName})` +
        `&body=Error text: ${error.message}%0D%0A Additional information:"` +
        `>${this.parameters.contact}</a> to share ` +
        `the details of this error.`;
      textInstructions.style.margin = "20px";
    }

    // Button to end the experiment
    const endButton = document.createElement("button");
    endButton.textContent = "End Experiment";
    endButton.classList.add("jspsych-btn");
    endButton.onclick = () => {
      // End the experiment and provide an error message
      this.jsPsych.endExperiment(
        "The experiment has ended early due to an error occurring."
      );
    };

    // Replace the content of the document.body
    if (target) {
      // Populate the container
      container.append(
        heading,
        subheading,
        errorContainer,
        textInstructions,
        endButton
      );

      // Update the styling of the target
      target.style.display = "flex";
      target.style.justifyContent = "center";
      target.append(container);
    }
  };

  random = () => {
    return this._generator();
  };
}

export default NeurocogExtension;
