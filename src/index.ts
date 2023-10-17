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
 * the Neurocog instance
 */
interface InitializeParameters {
  name: string;
  studyName: string;

  // Gorilla manipulations
  manipulations: {
    [manipulationName: string]: number | string | boolean | any;
  };

  // Gorilla resources
  resources: {
    [resourceName: string]: string;
  };

  // Gorilla stimuli
  stimuli: {
    [stimulusName: string]: string;
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
 * experiment platform.
 *
 * @author Henry Burgess
 * @see {@link https://github.com/henryjburg/Neurocog.js Repository}
 */
class NeurocogExtension implements JsPsychExtension {
  static info: JsPsychExtensionInfo = {
    name: "Neurocog",
  };

  private parameters: InitializeParameters; // Parameters to configure Neurocog.js

  // Toggles
  private _useAPI: boolean; // Toggle to indicate if task is using the Gorilla API

  // API and Extension components
  private _gorilla: GorillaAPI; // Gorilla API (defined if available)
  private _state: State; // State management
  private _stimuli: Stimuli; // Stimuli management
  private _resources: Resources; // Resource management
  private _manipulations: Manipulations; // Manipulation management
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
      // Copy and validate parameters
      this.parameters = params;
      this.validParameters();

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
        this._state = new State(this.parameters.state);
      } else {
        // Initialise with empty State
        this._state = new State();
      }

      // Configure and load the experiment Stimuli, Resources, and Manipulations
      this._stimuli = new Stimuli(this.parameters.stimuli);
      this._resources = new Resources(this.parameters.resources);
      this._manipulations = new Manipulations(this.parameters.manipulations);

      // Resolve now setup is complete
      consola.success("Successfully initialized Neurocog extension");
      if (this._useAPI) {
        this._gorilla.ready(() => {});
        consola.info("Gorilla API ready");
        this.jsPsych.getInitSettings().on_finish = (() => {
          // Cache the existing `on_finish` function and append the `finish` Gorilla API call
          var cachedFunction = this.jsPsych.getInitSettings().on_finish;
          return () => {
            cachedFunction.apply(this);
            this._gorilla.finish();
          };
        })();
      }
      resolve();
    });
  };

  on_start = (params: OnStartParameters): void => {};

  on_load = (params: OnLoadParameters): void => {};

  /**
   * Function called and the end of a trial. Used to submit data to the
   * the Gorilla API if using the API.
   * @param {OnFinishParameters} params set of parameters for callback
   * @return {{ [key: string]: any }}
   */
  on_finish = (params: OnFinishParameters): { [key: string]: any } => {
    if (this._useAPI && this.jsPsych.data.getLastTrialData().last().values().length > 0) {
      // Store all jsPsych data in Gorilla automatically
      this._gorilla.metric(this.jsPsych.data.getLastTrialData().last().values()[0]);
    }
    return {};
  };

  /**
   * Utility function to check that all required parameters are passed to the
   * extension. Generates an error if parameters are missing, listing the
   * missing parameters.
   * @return {boolean}
   */
  private validParameters(): boolean {
    const RequiredInitializeParameters = ["name", "studyName", "manipulations", "resources", "stimuli", "allowParticipantContact", "contact"];
    const parameterComparison = _.difference(RequiredInitializeParameters, Object.keys(this.parameters));

    if (parameterComparison.length > 0) {
      consola.error(`Extension missing required initialization parameters:\n${parameterComparison.join(", ")}`);
    }
    return true;
  };

  /**
   * Utility function to generate and display an error message to the participant.
   * Handles the "error" event.
   * @param {Error | ErrorEvent} error a class instance containing error information
   */
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

  /**
   * Generate a new random float using the D3 library
   * @return {number}
   */
  public random = (): number => {
    return this._generator();
  };

  /** ---------- Stimuli ---------- */
  /**
   * Retrieve the collection of all Stimuli
   * @return {(): { [stimulus: string]: string }} A collection of Stimuli identifiers or filenames,
   * pointing to paths to each Stimulus
   */
  public getStimuli = (): () => { [stimulus: string]: string } => {
    return () => this._stimuli.getAll();
  }

  /**
   * Retrieve a single Stimulus, identified by a key or filename
   * @param {string} stimulus Identifier or filename of the Stimulus
   * @return {(): string} Path to the Stimulus, either locally or via an API
   */
  public getStimulus = (stimulus: string): () => string => {
    return () => this._stimuli.getOne(stimulus);
  }

  /** ---------- Resources ---------- */
  /**
   * Retrieve the collection of all Resources
   * @return {(): { [resource: string]: string }} A collection of Resources identifiers or filenames,
   * pointing to paths to each Resource
   */
  public getResources = (): () => { [resource: string]: string } => {
    return () => this._resources.getAll();
  }

  /**
   * Retrieve a single Resource, identified by a key or filename
   * @param {string} resource Identifier or filename of the Resource
   * @return {(): string} Path to the Resource, either locally or via an API
   */
  public getResource = (resource: string): () => string => {
    return () => this._stimuli.getOne(resource);
  }

  /** ---------- State ---------- */
  public getState(key: string): any | null {
    return this._state.get(key);
  }

  public setState(key: string, value: any): void {
    return this._state.set(key, value);
  }

  /** ---------- Manipulations ---------- */
  public getManipulation(key: string): any | null {
    return this._manipulations.getOne(key);
  }
};

export default NeurocogExtension;
