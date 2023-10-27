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
import { State } from "./api/State";

/**
 * Interface to describe initialization parameters, configuring
 * the Neurocog instance
 */
interface InitializeParameters {
  name: string;
  studyName: string;

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
  private _generator: () => number; // Random generator function

  constructor(private jsPsych: JsPsych) {
    this.jsPsych = jsPsych;
    this._useAPI = false;

    // Determine environment (API or otherwise)
    if (isPlatform()) {
      this._useAPI = true;
      this._gorilla = window["gorilla"];
      consola.info("Gorilla API detected");
    }

    // Initialise with empty State
    this._state = new State();
  };

  /**
   * Params are passed from the extensions parameter in `jsPsych.init`
   * @param {InitializeParameters} params
   * @return {Promise<void>}
   */
  initialize = (params: InitializeParameters): Promise<void> => {
    return new Promise((resolve, reject) => {
      // Copy and validate parameters
      this.parameters = params;
      if (!this.validParameters()) {
        reject();
      }

      // Setup error handling
      window.addEventListener("error", this.invokeError.bind(this));

      // Setup the random number generator
      this._generator = randomUniform.source(randomLcg(this.parameters.seed))(0, 1);

      // Store the initial and global state (if defined)
      if (!_.isUndefined(this.parameters.state)) {
        // Initialise with provided State
        this._state = new State(this.parameters.state);
      }

      // Resolve now setup is complete
      if (this._useAPI) {
        this._gorilla.ready(() => {});
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
    const RequiredInitializeParameters = ["name", "studyName", "allowParticipantContact", "contact"];
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
   * Retrieve a single Stimulus, identified by a key or filename
   * @param {string} stimulus Identifier or filename of the Stimulus
   * @return {(): string} Path to the Stimulus, either locally or via an API
   */
  public getStimulus = (stimulus: string): string => {
    if (this._useAPI) {
      return this._gorilla.stimuliURL(stimulus);
    } else {
      return `stimuli/${stimulus}`;
    }
  }

  /**
   * @deprecated since version 1.1.0
   */
  public getStimuli = (): void => {
    consola.warn("Deprecated: `getStimuli` is deprecated, use `getStimulus(id)` to retrieve individual Stimuli.");
  }

  /** ---------- Resources ---------- */
  /**
   * Retrieve a single Resource, identified by a key or filename
   * @param {string} resource Identifier or filename of the Resource
   * @return {(): string} Path to the Resource, either locally or via an API
   */
  public getResource = (resource: string): string => {
    if (this._useAPI) {
      return this._gorilla.resourceURL(resource);
    } else {
      return `resources/${resource}`;
    }
  }

  /**
   * @deprecated since version 1.1.0
   */
  public getResources = (): void => {
    consola.warn("Deprecated: `getResources` is deprecated, use `getResource(id)` to retrieve individual Resources.");
  }

  /** ---------- State ---------- */
  public getState(key: string): any | null {
    return this._state.get(key);
  }

  public setState(key: string, value: any): void {
    this._state.set(key, value);
  }

  /** ---------- Manipulations ---------- */
  /**
   * Retrieve and return experimental manipulations. Primarily intended for usage with the Gorilla platform,
   * this function will retrieve the manipulation value from the Gorilla API, otherwise a 'default' value will be
   * returned with a warning.
   * @param {string} key manipulation key, defined in the Gorilla task
   * @param {any} defaultValue a default value, returned when Gorilla is not available
   * @return {any}
   */
  public getManipulation(key: string, defaultValue: any): typeof defaultValue {
    if (this._useAPI) {
      const rawValue = this._gorilla.manipulation(key);
      // Check that manipulation exists
      if (_.isUndefined(rawValue)) {
        consola.error(`Manipulations: Manipulation "${key}" is not defined!`);
        return null;
      }

      // Adjust value if return type is Boolean
      if (_.isBoolean(defaultValue)) {
        return _.isEqual(rawValue, "true") ? true : false;
      }

      // Validate type if not Boolean
      if (!_.isEqual(typeof rawValue, typeof defaultValue)) {
        consola.warn(`Manipulations: Inconsistent type of manipulation "${key}" (Gorilla: ${typeof rawValue}, default: ${typeof defaultValue})`);
      }

      // Return manipulation value
      return rawValue;
    } else {
      return defaultValue;
    }
  }
};

export default NeurocogExtension;
