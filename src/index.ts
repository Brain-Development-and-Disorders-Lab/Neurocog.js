// Import types
import type {
  Gorilla,
  jsPsych,
  jsPsychParameters,
} from "../types";
import type { Configuration } from "../types/Configuration";

// Import constants
import { Environments } from "./constants";

// Gorilla API features
import { Manipulations } from "./api/Manipulations";
import { Resources } from "./api/Resources";
import { Stimuli } from "./api/Stimuli";

import { State } from "./lib/State";

// Utility functions
import { checkScriptAttributes, clear, clearTimeouts } from "./functions";

// Logging library
import consola from "consola";

// Import styling
import "jspsych/css/jspsych.css";

// Import jsPsych & require preload plugin to ensure
// everything is bundled when compiled
import "jspsych/jspsych";
import "jspsych/plugins/jspsych-preload";

// Import and configure d3 for random number generation
// using a uniform random distribution
import { randomLcg, randomUniform } from "d3-random";

/**
 * Neurocog class to start and manage connection to jsPsych
 * or Gorilla if required
 * @summary
 */
export class Neurocog {
  // Environment the experiment is running on, initially 'Invalid'
  private environment: Environments = Environments.Invalid;

  // Instances of the window variables, initially set to 'undefined'
  private instances: {
    gorilla: Gorilla | undefined;
    jsPsych: jsPsych | undefined;
  };

  // Instance of RNG
  private generator: any;

  // Gorilla API features
  private manipulations: Manipulations;
  private resources: Resources;
  private stimuli: Stimuli;

  // State management
  private state: State;

  // Configuration
  private configuration: Configuration;

  /**
   * Default constructor
   * @param {Configuration} config configuration object
   * @class
   */
  constructor(config: Configuration) {
    // Assign the class instance to the window
    window["Neurocog"] = this;

    this.configuration = config;

    // Instantiate the 'instances'
    this.instances = {
      gorilla: undefined,
      jsPsych: undefined,
    };

    // Set the logging level
    if (this.configuration.logging) {
      consola.level = this.configuration.logging;
    }

    // Add the error handler
    this.setupErrorHandler();

    // Detect the Environment
    this.setEnvironment(this.detectEnvironment());

    // Configure the d3 RNG
    this.generator = randomUniform.source(randomLcg(this.configuration.seed))(0, 1);

    // Store the initial and global state (if defined)
    if (config.state) {
      // Initialise with given State
      this.state = new State(config.state);
    } else {
      // Initialise with empty State
      this.state = new State();
    }

    // Check the context of the script to try and catch any errors
    if (checkScriptAttributes() === false) {
      consola.error(new Error("Context check failed, halting experiment"));
    }

    // Setup Gorilla API features
    this.manipulations = new Manipulations(this.configuration.manipulations);
    this.resources = new Resources(this.configuration.resources);
    this.stimuli = new Stimuli(this.configuration.stimuli);
  }

  /**
   * Get the experiment configuration data
   * @return {Configuration}
   */
  public getConfiguration(): Configuration {
    return this.configuration;
  }

  /**
   * Update and set the environment
   * @param {Environments} environment updated environment
   */
  private setEnvironment(environment: Environments) {
    if (environment !== this.environment) {
      consola.info(`Environment updated to '${environment}'`);
    }
    this.environment = environment;
  }

  /**
   * Get the current Environment the Experiment is running in
   * @return {Environments}
   */
  public getEnvironment(): Environments {
    return this.environment;
  }

  /**
   * Return the global state instance of the
   * experiment
   * @return {State}
   */
  public getState(): State {
    return this.state;
  }

  /**
   * Generate and return a random number from a uniform
   * distribution in [0, 1)
   * @return {number}
   */
  public random(): number {
    return this.generator();
  }

  /**
   * Detect the Environment that the experiment is running on
   * @return {Environments} Environment name
   */
  private detectEnvironment(): Environments {
    // Check for Gorilla
    if (Environments.Gorilla in window) {
      consola.success(`Gorilla instance found`);

      // Store the Environments
      this.instances.gorilla = window.gorilla;
    }

    // Check for jsPsych
    if (Environments.jsPsych in window) {
      consola.success(`jsPsych instance found`);

      // Store the Environments
      this.instances.jsPsych = window.jsPsych;
    }

    // Return the correct Environments
    if (this.instances.gorilla) {
      // Gorilla was found
      return Environments.Gorilla;
    } else if (this.instances.jsPsych) {
      // jsPsych found but not Gorilla
      return Environments.jsPsych;
    }

    // Big issue if we are here
    consola.error(new Error("No valid Environments detected"));
    return Environments.Invalid;
  }

  /**
   * Setup the error handler by listening for the 'error' event
   */
  private setupErrorHandler(): void {
    window.addEventListener("error", this.invokeError.bind(this));
  }

  /**
   * Invoke an error, displaying error screen to participant
   * @param {Error | ErrorEvent} error object containing error information
   */
  public invokeError(error: Error | ErrorEvent): void {
    const target = document.getElementById("jspsych-content");
    clearTimeouts();
    clear(target, true);

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
    if (this.configuration.allowParticipantContact === true) {
      textInstructions.innerHTML =
        `Please send an email to ` +
        `<a href="mailto:${this.configuration.contact}?` +
        `subject=Error (${this.configuration.studyName})` +
        `&body=Error text: ${error.message}%0D%0A Additional information:"` +
        `>${this.configuration.contact}</a> to share ` +
        `the details of this error.`;
      textInstructions.style.margin = "20px";
    }

    // Button to end the experiment
    const endButton = document.createElement("button");
    endButton.textContent = "End Experiment";
    endButton.classList.add("jspsych-btn");
    endButton.onclick = () => {
      // End the experiment and provide an error message
      window.jsPsych.endExperiment(
        "The experiment ended early due to an error occurring."
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
  }

  /**
   * Retrieve an instance of a Environment to utilise
   * in integration
   * @param {string} environment identifier of the platform
   * @return {Gorilla | jsPsych | null} platform instance
   */
  public getHook(environment: string): Gorilla | jsPsych | null {
    switch (environment) {
      case Environments.Gorilla:
        if (this.instances.gorilla) {
          return this.instances.gorilla;
        } else {
          return null;
        }
      case Environments.jsPsych:
        if (this.instances.jsPsych) {
          return this.instances.jsPsych;
        } else {
          return null;
        }
      default:
        consola.warn(`Hook '${environment}' not found`);
        return null;
    }
  }

  public getManipulations(): Manipulations {
    return this.manipulations;
  }

  public getResources(): Resources {
    return this.resources;
  }

  /**
   * Retrieve the collection of loaded images
   * @return {Stimuli}
   */
  public getStimuli(): Stimuli {
    return this.stimuli;
  }

  /**
   * Start the experiment
   * @param {jsPsychParameters} parameters collection of the jsPsych
   * timeline nodes to execute.
   */
  public start(parameters: jsPsychParameters): void {
    consola.debug(`Running start() function.`);

    if (this.environment === Environments.Gorilla) {
      // Initialise jsPsych and Gorilla (if required)
      const gorilla = this.getHook(Environments.Gorilla) as Gorilla;
      const jsPsych = this.getHook(Environments.jsPsych) as jsPsych;

      // Bring the stimuli into the local scope
      // Make sure Gorilla and jsPsych are loaded
      if (typeof jsPsych !== "undefined" && typeof gorilla !== "undefined") {
        consola.debug(
          `Added 'preload' node to timeline:`,
          Object.values(this.configuration.stimuli)
        );

        // Display element
        parameters.display_element = document.getElementById("gorilla");

        const stimuli = this.configuration.stimuli;
        if (stimuli && Object.values(stimuli).length > 0) {
          consola.debug(`Preloading images:`, Object.values(stimuli));

          // Add a new timeline node to preload the images
          parameters.timeline.unshift({
            type: "preload",
            auto_preload: true,
            images: Object.values(stimuli),
          });

          // Set the 'preload_images' parameter
          parameters.preload_images = Object.values(stimuli);
        }

        // 'on_data_update' callback
        parameters.on_data_update = function (data: any) {
          gorilla.metric(data);
        };

        // 'on_finish' callback
        parameters.on_finish = function () {
          gorilla.finish();
        };

        consola.debug(`Configured jsPsych parameters:`, parameters);

        // Start Gorilla and initialise jsPsych with the updated
        // parameters
        gorilla.ready(function () {
          consola.debug(`Starting jsPsych...`);
          jsPsych.init(parameters);
        });
      } else {
        consola.error(new Error(`Gorilla or jsPsych not loaded`));
      }
    } else {
      // Initialise jsPsych
      const jsPsych = this.getHook(Environments.jsPsych) as jsPsych;
      consola.debug(`Retrieved jsPsych:`, jsPsych);

      // Make sure jsPsych is loaded
      if (typeof jsPsych !== "undefined") {
        // Update the parameters object with required functions
        // and properties
        // 'on_finish' callback
        parameters.on_finish = function () {
          jsPsych.data
            .get()
            .localSave(`csv`, `experiment_complete_${Date.now()}.csv`);
        };

        // 'preload_images' value
        const stimuli = this.configuration.stimuli;
        if (stimuli && Object.values(stimuli).length > 0) {
          consola.debug(`Preloading images:`, Object.values(stimuli));

          // Add a new timeline node to preload the images
          parameters.timeline.unshift({
            type: "preload",
            auto_preload: true,
            images: Object.values(stimuli),
          });

          // Set the 'preload_images' parameter
          parameters.preload_images = Object.values(stimuli);
        }

        consola.debug(`Configured jsPsych parameters:`, parameters);

        // Initialise jsPsych with the updated parameters
        consola.debug(`Starting jsPsych...`);
        jsPsych.init(parameters);
      } else {
        consola.error(new Error(`jsPsych not loaded`));
      }
    }
  }
}

export default Neurocog;
