// Utility functions
import { isPlatform } from "src/util";

// Logging library
import consola from "consola";

/**
 * @summary Utility class to load Stimuli and setup any API calls if required
 */
export class Stimuli {
  private collection: { [x: string]: string };
  private isLinked: boolean;

  /**
   * Default constructor
   * @param {any} collection Stimuli to load and manage
   * @class
   */
  constructor(collection: { [x: string]: string }) {
    this.collection = collection;
    this.isLinked = false;

    // Link stimuli to Gorilla API functions if required
    this.link();
    consola.debug(`Created new "Stimuli" instance with ${Object.keys(collection).length} stimuli`);
  }

  /**
   * Linking method for the stimuli collection
   */
  private link(): void {
    // Check if the images are named consistently
    Object.keys(this.collection).forEach((image) => {
      if (!this.collection[image].endsWith(image)) {
        consola.warn(`Stimulus "${image}" named inconsistently`);
      }
    });

    if (isPlatform()) {
      // Populate the image collection for Gorilla
      // Grab the Gorilla API from the browser
      const gorilla: GorillaAPI = window["gorilla"];

      // For each of the images from the desktop build, we
      // want to create a new API call to retrieve each from
      // the Gorilla platform
      Object.keys(this.collection).forEach((image) => {
        // Generate the new API call
        this.collection[image] = gorilla.stimuliURL(image);
      });
    }
    this.isLinked = true;
  }

  /**
   * Get the image collection
   * @return {{ [x: string]: string }}
   */
  public getAll(): { [x: string]: string } {
    if (this.isLinked) {
      // Return the collection if loaded images
      return this.collection;
    }

    // Raise error and return empty if not loaded yet
    consola.error(
      new Error(
        `Image collection not loaded before accessing! ` +
          `Ensure "link()" has been called.`
      )
    );
    return {};
  }

  /**
   * Get the path to a stimulus stored locally or remotely
   * @param {string} stimulus the key used to reference the stimulus
   * @return {string}
   */
  public getOne(stimulus: string): string {
    consola.debug(`"getOne" called for stimulus:`, stimulus);
    if (Object.keys(this.collection).includes(stimulus)) {
      // Check that the stimulus exists
      return this.collection[stimulus];
    } else {
      consola.error(new Error(`Stimulus "${stimulus}" not found!`));
      return "";
    }
  }
}
