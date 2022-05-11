// Import classes
import { Platforms } from "./lib/constants";
import { Manipulations } from "./lib/classes/Manipulations";
import { Resources } from "./lib/classes/Resources";
import { State } from "./lib/classes/State";
import { Stimuli } from "./lib/classes/Stimuli";

// Import types
import type {
  Gorilla,
  jsPsych,
  jsPsychParameters,
  Configuration,
} from "../types";

// Utility functions
import { checkContext, clear, clearTimeouts } from "./lib/functions";

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
 * Experiment class to start and manage connection to jsPsych
 * or Gorilla if required
 * @summary
 */
export class Experiment {
  // Platform the experiment is running on, initially 'Invalid'
  private platform: Platforms = Platforms.Invalid;

  // Instances of the window variables, initially set to 'undefined'
  private instances: {
    gorilla: Gorilla | undefined;
    jsPsych: jsPsych | undefined;
  };

  // Instance of RNG
  private generator: any;

  // Collection of stimuli
  private stimuliCollection: Stimuli;

  // State management
  private state: State;

  // Configuration
  private config: Configuration;

  // 'Loaded' state
  private loaded: boolean;

  /**
   * Default constructor
   * @param {Configuration} config configuration object
   * @class
   */
  constructor(config: Configuration) {
    // Assign the experiment to the window
    window["Experiment"] = this;

    this.config = config;

    // Set the state to be 'unloaded'
    this.loaded = false;

    // Instantiate the 'instances'
    this.instances = {
      gorilla: undefined,
      jsPsych: undefined,
    };

    // Set the logging level
    if (this.config.logging) {
      consola.level = this.config.logging;
    }

    // Configure the d3 RNG
    this.generator = randomUniform.source(randomLcg(this.config.seed))(0, 1);

    // Add the error handler
    this.setupErrorHandler();

    // Store the initial and global state (if defined)
    if (config.state) {
      // Initialise with given State
      this.state = new State(config.state);
    } else {
      // Initialise with empty State
      this.state = new State();
    }

    // Created new 'Stimuli' instance with a collection
    this.stimuliCollection = new Stimuli(this.config.stimuli);

    // Check the context of the script to try and catch any errors
    if (checkContext() === false) {
      consola.error(new Error("Context check failed, halting experiment"));
    } else {
      // Load all stimuli used in the Experiment.
      this.load();
    }
  }

  /**
   * Loading function, responsible for connecting
   * to the Gorilla API properly.
   */
  public load() {
    // Detect and update the target in the configuration
    this.setPlatform(this.detectPlatforms());

    // Load all the stimuli
    this.loadStimuli();

    // Configure the manipulations and resources in the configuration file
    if (this.platform === Platforms.Gorilla) {
      Manipulations.link(this.config.manipulations);
      Resources.link(this.config.resources);
    }

    this.loaded = true;
  }

  /**
   * Get the experiment configuration data
   * @return {Configuration}
   */
  public getConfiguration(): Configuration {
    return this.config;
  }

  /**
   * Update and set the target
   * @param {Platforms} target updated target
   */
  private setPlatform(target: Platforms) {
    if (target !== this.platform) {
      consola.info(`Target updated to '${target}'`);
    }
    this.platform = target;
  }

  /**
   * Get the current platform the Experiment is running on
   * @return {Platforms}
   */
  public getPlatform(): Platforms {
    return this.platform;
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
   * Detect the platform that the experiment is running on
   * @return {Platforms} platform name
   */
  private detectPlatforms(): Platforms {
    // Check for Gorilla
    if (
      Platforms.Gorilla in window
    ) {
      consola.success(`Gorilla instance found`);

      // Store the platform
      this.instances.gorilla = window.gorilla;
    }

    // Check for jsPsych
    if (Platforms.jsPsych in window) {
      consola.success(`jsPsych instance found`);

      // Store the platform
      this.instances.jsPsych = window.jsPsych;
    }

    // Return the correct platform
    if (this.instances.gorilla) {
      // Gorilla was found
      return Platforms.Gorilla;
    } else if (this.instances.jsPsych) {
      // jsPsych found but not Gorilla
      return Platforms.jsPsych;
    }

    // Big issue if we are here
    consola.error(new Error("No valid platforms detected"));
    return Platforms.Invalid;
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
    if (this.config.allowParticipantContact === true) {
      textInstructions.innerHTML =
        `Please send an email to ` +
        `<a href="mailto:${this.config.contact}?` +
        `subject=Error (${this.config.studyName})` +
        `&body=Error text: ${error.message}%0D%0A Additional information:"` +
        `>${this.config.contact}</a> to share ` +
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
   * Retrieve an instance of a platform to utilise
   * in integration
   * @param {string} platform identifier of the platform
   * @return {Gorilla | jsPsych | null} platform instance
   */
  public getHook(platform: string): Gorilla | jsPsych | null {
    switch (platform) {
      case Platforms.Gorilla:
        if (this.instances.gorilla) {
          return this.instances.gorilla;
        } else {
          return null;
        }
      case Platforms.jsPsych:
        if (this.instances.jsPsych) {
          return this.instances.jsPsych;
        } else {
          return null;
        }
      default:
        consola.warn(`Hook '${platform}' not found`);
        return null;
    }
  }

  /**
   * Load the stimuli and setup the ImageCollection
   * instance
   */
  private loadStimuli() {
    this.stimuliCollection.load();
  }

  /**
   * Retrieve the collection of loaded images
   * @return {Stimuli}
   */
  public getStimuli(): Stimuli {
    return this.stimuliCollection;
  }

  /**
   * Start the experiment
   * @param {jsPsychParameters} parameters collection of the jsPsych
   * timeline nodes to execute.
   */
  public start(parameters: jsPsychParameters): void {
    consola.debug(`Running start() function.`);

    if (this.loaded === false) {
      consola.error(
        new Error(
          `Cannot start until all resources are loaded, ` +
            `ensure 'load()' is called prior to 'start()'`
        )
      );
    }

    if (this.platform === Platforms.Gorilla) {
      // Initialise jsPsych and Gorilla (if required)
      const gorilla = this.getHook(Platforms.Gorilla) as Gorilla;
      const jsPsych = this.getHook(Platforms.jsPsych) as jsPsych;

      // Bring the stimuli into the local scope
      // Make sure Gorilla and jsPsych are loaded
      if (typeof jsPsych !== "undefined" && typeof gorilla !== "undefined") {
        consola.debug(
          `Added 'preload' node to timeline:`,
          Object.values(this.config.stimuli)
        );

        // Update the parameters object with required functions
        // and properties
        // Display element
        parameters.display_element = document.getElementById("gorilla");

        const stimuli = this.config.stimuli;
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
      const jsPsych = this.getHook(Platforms.jsPsych) as jsPsych;
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
        const stimuli = this.config.stimuli;
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

export default Experiment;
