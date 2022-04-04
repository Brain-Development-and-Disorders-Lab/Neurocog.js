// Imports
import { ErrorHandler } from './lib/api/jspsych/ErrorHandler';
import { Platforms } from './lib/constants';
import { Manipulations } from './lib/api/gorilla/Manipulations';
import { State } from './lib/classes/State';
import { Stimuli } from './lib/api/gorilla/Stimuli';

// Utility functions
import { checkContext } from './lib/functions';

// Logging library
import consola from 'consola';

// Import styling
import 'jspsych/css/jspsych.css';
import './css/styles.css';

// Import jsPsych & require preload plugin to ensure
// everything is bundled when compiled
import 'jspsych/jspsych';
import 'jspsych/plugins/jspsych-preload';

// Import and configure d3 for random number generation
// using a uniform random distribution
import { randomLcg, randomUniform } from 'd3-random';

// Import jQuery for Gorilla integration only
import $ from 'jquery';

/**
 * Experiment class to start and manage connection to jsPsych
 * or Gorilla if required
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
   */
  constructor(config: Configuration) {
    // Assign the experiment to the window
    window['Experiment'] = this;

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
    new ErrorHandler(config);

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
      consola.error(new Error('Context check failed, halting experiment'));
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
    // Add the event listener for the 'load' event
    // Detect and update the target in the configuration
    this.setPlatform(this.detectPlatforms());

    // Load all the stimuli
    this.loadStimuli();

    // Configure the manipulations in the configuration file
    if (this.platform === Platforms.Gorilla) {
      new Manipulations(this.config.manipulations);
    }

    this.loaded = true;
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
   * @param {Platforms} _target updated target
   */
  private setPlatform(_target: Platforms) {
    if (_target !== this.platform) {
      consola.info(`Target updated to '${_target}'`);
    }
    this.platform = _target;
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
      Platforms.Gorilla in window &&
      window.location.href.includes(Platforms.Gorilla)
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
    consola.error(new Error('No valid platforms detected'));
    return Platforms.Invalid;
  }

  /**
   * Retrieve an instance of a platform to utilise
   * in integration
   * @param {string} platform identifier of the platform
   * @return {any} platform instance
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
   * @return {any}
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
      if (typeof jsPsych !== 'undefined' && typeof gorilla !== 'undefined') {
        consola.debug(
          `Added 'preload' node to timeline:`,
          Object.values(this.config.stimuli)
        );

        // Update the parameters object with required functions
        // and properties
        // Display element
        parameters.display_element = $('#gorilla')[0];

        const stimuli = this.config.stimuli;
        if (stimuli && Object.values(stimuli).length > 0) {
          consola.debug(`Preloading images:`, Object.values(stimuli));

          // Add a new timeline node to preload the images
          parameters.timeline.unshift({
            type: 'preload',
            auto_preload: true,
            images: Object.values(stimuli),
          });

          // Set the 'preload_images' parameter
          parameters.preload_images = Object.values(stimuli);
        }

        // 'on_data_update' callback
        parameters.on_data_update = function(data: any) {
          gorilla.metric(data);
        };

        // 'on_finish' callback
        parameters.on_finish = function() {
          gorilla.finish();
        };

        consola.debug(`Configured jsPsych parameters:`, parameters);

        // Start Gorilla and initialise jsPsych with the updated
        // parameters
        gorilla.ready(function() {
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
      if (typeof jsPsych !== 'undefined') {
        // Update the parameters object with required functions
        // and properties
        // 'on_finish' callback
        parameters.on_finish = function() {
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
            type: 'preload',
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
