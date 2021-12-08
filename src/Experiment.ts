// Imports
import {PLATFORMS} from './Constants';
import {Manipulations} from './api/Manipulations';
import {Stimuli} from './api/Stimuli';

import {clear, scale} from './Functions';

// Logging library
import consola from 'consola';

// Import jsPsych & require preload plugin to ensure
// everything is bundled when compiled
import 'jspsych/jspsych';
import 'jspsych/plugins/jspsych-preload';

// Import any experiment styling
import 'jspsych/css/jspsych.css';
import './css/styles.css';

// Import and configure seedrandom for random number generation
import seedrandom from 'seedrandom';

// Import jQuery for Gorilla integration only
import $ from 'jquery';

/**
 * Experiment class to start and manage connection to jsPsych
 * or Gorilla if required
 */
export class Experiment {
  // Platform the experiment is running on
  private platform: string;

  // Instances of the window variables, initially
  // set to 'undefined'
  private instances: {
    gorilla: undefined,
    jsPsych: undefined,
  };

  // Collection of stimuli
  private stimuliCollection: Stimuli;

  // Configuration
  private config: Configuration;

  /**
   * Default constructor
   * @param {Configuration} config configuration object
   */
  constructor(config: Configuration) {
    // Assign the experiment to the window
    window['Experiment'] = this;

    // Configure seedrandom
    window.Math.random = seedrandom(config.seed);

    this.config = config;

    // Detect and update the target in the configuration
    this.setPlatform(this.detectPlatforms());

    // Load all the stimuli
    this.loadStimuli();

    // Configure the manipulations in the configuration file
    if (this.platform === PLATFORMS.GORILLA) {
      new Manipulations(config.manipulations);
    }
  }

  /**
   * Get the experiment configuration object
   * @return {Config}
   */
  public getConfiguration(): Configuration {
    return this.config;
  }

  /**
   * Update and set the target
   * @param {string} _target updated target
   */
  private setPlatform(_target: string) {
    if (_target !== this.platform) {
      consola.info(`Target updated to '${_target}'`);
    }
    this.platform = _target;
  }

  /**
   * Get the current platform the Experiment is running on
   * @return {string}
   */
  public getPlatform(): string {
    return this.platform;
  }

  /**
   * Detect the platform that the experiment is running on
   * @return {string} platform name
   */
  private detectPlatforms(): string {
    // Instantiate hook storage
    this.instances = {
      gorilla: null,
      jsPsych: null,
    };

    // Check for Gorilla
    if (PLATFORMS.GORILLA in window) {
      consola.info(`Gorilla instance found`);

      // Store the platform
      this.instances.gorilla = window[PLATFORMS.GORILLA];
    }

    // Check for jsPsych
    if (PLATFORMS.JSPSYCH in window) {
      consola.info(`jsPsych instance found`);

      // Store the platform
      this.instances.jsPsych = window[PLATFORMS.JSPSYCH];
    }

    // Return the correct platform
    if (this.instances.gorilla) {
      // Gorilla was found
      return PLATFORMS.GORILLA;
    } else if (this.instances.jsPsych) {
      // jsPsych found but not Gorilla
      return PLATFORMS.JSPSYCH;
    } else {
      // Big issue if we are here
      throw new Error('No valid platforms detected');
    }
  }

  /**
   * Setup and enable the global error handler.
   * Listens for the 'onerror' event
   */
  private setupErrorHandler(): void {
    window.onerror = (_event: any) => {
      // Heading text
      const heading = document.createElement('h1');
      heading.textContent = 'Oh no!';

      // Subheading
      const subheading = document.createElement('h2');
      subheading.textContent = 'It looks like an error has occurred.';

      // Container for the error information
      const errorContainer = document.createElement('div');
      errorContainer.style.margin = '20px';

      // 'Error description:' text
      const textIntroduction = document.createElement('p');
      textIntroduction.textContent = 'Error description:';

      // Error description
      const description = document.createElement('code');
      description.innerText = _event;
      description.style.gap = '20rem';
      errorContainer.append(textIntroduction, description);

      // Follow-up instructions
      const textInstructions = document.createElement('p');
      if (this.config.allowParticipantContact === true) {
        textInstructions.innerHTML =
            `Please send an email to ` +
            `<a href="mailto:${this.config.contact}?` +
              `subject=Error (${this.config.studyName})` +
              `&body=Error text: ${_event}%0D%0A` +
              `Additional information:"` +
            `>${this.config.contact}` +
            `</a> to share ` +
            `the details of this error.`;
        textInstructions.style.margin = '20px';
      }

      // Button to end the experiment
      const endButton = document.createElement('button');
      endButton.textContent = 'End Experiment';
      endButton.classList.add('jspsych-btn');
      endButton.onclick = () => {
        jsPsych.endExperiment(
            'The experiment ended early due to an error occurring.'
        );
      };

      // Clear and replace the content of the document.body
      const contentContainer = document.getElementById('jspsych-content');
      clear(contentContainer);
      contentContainer.append(
          heading,
          subheading,
          errorContainer,
          textInstructions,
          endButton,
      );
    };
  }

  /**
   * Retrieve an instance of a platform to utilise
   * in integration
   * @param {string} platform identifier of the platform
   * @return {any} platform instance
   */
  private getHook(platform: string): Gorilla | jsPsych | null {
    if (this.instances[platform]) {
      return this.instances[platform];
    } else {
      consola.warn(`Hook '${platform}' not found`);
      return null;
    }
  }

  /**
   * Load the stimuli and setup the ImageCollection
   * instance
   */
  private loadStimuli() {
    this.stimuliCollection = new Stimuli(this.config.stimuli);
    this.stimuliCollection.load();
  }

  /**
   * Retrieve the collection of loaded images
   * @return {any}
   */
  public getStimuli(): any {
    return this.stimuliCollection.getCollection();
  }

  /**
   * Start the experiment
   * @param {Init} parameters collection of the jsPsych
   * timeline nodes to execute.
   */
  public start(parameters: jsPsychParameters): void {
    // Add the error handler
    this.setupErrorHandler();

    if (this.platform === PLATFORMS.GORILLA) {
      // Initialise jsPsych and Gorilla (if required)
      const gorilla = this.getHook(PLATFORMS.GORILLA) as Gorilla;
      const jsPsych = this.getHook(PLATFORMS.JSPSYCH) as jsPsych;

      // Populate the image collection for Gorilla
      Object.keys(this.config.stimuli).forEach((image) => {
        this.config.stimuli[image] = gorilla.stimuliURL(image);
      });

      // Create a new timeline node to preload the images
      parameters.timeline.unshift({
        type: 'preload',
        auto_preload: true,
        images: Object.values(this.config.stimuli),
      });

      // Bring the stimuli into the local scope
      const stimuli = this.config.stimuli;

      // Make sure Gorilla and jsPsych are loaded
      if (typeof jsPsych !== 'undefined' && typeof gorilla !== 'undefined') {
        // Update the parameters object with required functions
        // and properties
        // Display element
        parameters.display_element = $('#gorilla')[0];

        // 'on_data_update' callback
        parameters.on_data_update = function(data) {
          gorilla.metric(data);
        };

        // 'on_finish' callback
        parameters.on_finish = function() {
          gorilla.finish();
        };

        // 'preload_images' value
        parameters.preload_images = Object.values(stimuli);

        // Start Gorilla and initialise jsPsych with the updated
        // parameters
        gorilla.ready(function() {
          jsPsych.init(parameters);
        });
      } else {
        throw new Error(`Gorilla or jsPsych not loaded`);
      }
    } else {
      // Initialise jsPsych
      const jsPsych = this.getHook(PLATFORMS.JSPSYCH) as jsPsych;

      // Add a new timeline node to preload the images
      parameters.timeline.unshift({
        type: 'preload',
        auto_preload: true,
        images: Object.values(this.config.stimuli),
      });

      // Bring the stimuli into the local scope
      const stimuli = this.config.stimuli;

      // Make sure jsPsych is loaded
      if (typeof jsPsych !== 'undefined') {
        // Update the parameters object with required functions
        // and properties
        // 'on_finish' callback
        parameters.on_finish = function() {
          jsPsych.data.get().localSave(
              `csv`,
              `experiment_complete_${Date.now()}.csv`
          );
        };

        // 'preload_images' value
        parameters.preload_images = Object.values(stimuli);

        // Initialise jsPsych with the updated parameters
        jsPsych.init(parameters);
      } else {
        throw new Error(`jsPsych not loaded`);
      }
    }

    // Scale everything
    scale();
  }
}

export default {Experiment};
