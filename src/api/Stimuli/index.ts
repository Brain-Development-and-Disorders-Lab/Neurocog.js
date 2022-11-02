// Interface
import { APIFeature } from "../APIFeature";

// Imports
import { Environments } from "../../constants";

// Logging library
import consola from "consola";

/**
 * @summary Utility class to load stimuli and setup any API calls if required
 */
export class Stimuli implements APIFeature {
  private collection: { [x: string]: string };
  private isLoaded: boolean;

  /**
   * Default constructor
   * @param {any} collection stimuli to load and manage
   * @class
   */
  constructor(collection: { [x: string]: string }) {
    this.collection = collection;
    this.isLoaded = false;

    consola.debug(
      `Created new 'Stimuli' instance with collection:`,
      this.collection
    );

    // Check if the stimuli are named consistently
    Object.keys(this.collection).forEach((stimulus) => {
      if (!this.collection[stimulus].endsWith(stimulus)) {
        consola.warn(`Stimulus '${stimulus}' named inconsistently`);
      }
    });

    // Get the Neurocog object to determine the platform
    const Neurocog = window.Neurocog;

    if (Neurocog.getEnvironment() === Environments.Gorilla) {
      this.setup();
    } else {
      consola.debug(`jsPsych only, local stimuli are already loaded.`);
      this.isLoaded = true;
    }
  }

  /**
   * Loader method for the StimuliCollection
   */
  private setup(): void {
    // Populate the stimulus collection for Gorilla
    // Grab the Gorilla API from the browser
    const gorilla = window.gorilla;

    // For each of the stimuli specified in the configuration, we
    // want to create a new API call to retrieve each from
    // the Gorilla platform
    Object.keys(this.collection).forEach((stimulus) => {
      // Generate the new API call
      this.collection[stimulus] = gorilla.stimuliURL(stimulus);
    });
    consola.debug(`All stimulli attached to 'stimuliURL'.`);

    this.isLoaded = true;
  }

  /**
   * Get the stimulus collection
   * @return {{ [x: string]: string }}
   */
  public getAll(): { [x: string]: string } {
    if (this.isLoaded) {
      // Return the collection if loaded stimuli
      return this.collection;
    }

    // Raise error and return empty if not loaded yet
    consola.error(
      new Error(
        `Image collection not loaded before accessing! ` +
          `Ensure 'load()' has been called.`
      )
    );
    return {};
  }

  /**
   * Get the path to a stimulus stored locally or remotely
   * @param {string} stimulus the key used to reference the imagstimuluse
   * @return {string}
   */
  public get(stimulus: string): string {
    consola.debug(`'getStimulus' called for stimulus:`, stimulus);
    if (Object.keys(this.collection).includes(stimulus)) {
      // Check that the stimulus exists
      return this.collection[stimulus];
    } else {
      consola.error(new Error(`Stimulus '${stimulus}' not found!`));
      return "";
    }
  }
}
