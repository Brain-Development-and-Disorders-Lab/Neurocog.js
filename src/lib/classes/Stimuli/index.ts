// Imports
import { Platforms } from '../../constants';

// Logging library
import consola from 'consola';

/**
 * @summary Utility class to load images and setup any API calls if required
 */
export class Stimuli {
  private collection: { [x: string]: string };
  private isLoaded: boolean;

  /**
   * Default constructor
   * @param {any} collection images to load and manage
   * @class
   */
  constructor(collection: { [x: string]: string }) {
    this.collection = collection;
    this.isLoaded = false;

    consola.debug(
      `Created new 'Stimuli' instance with collection:`,
      this.collection
    );
  }

  /**
   * Loader method for the ImageCollection
   */
  public load(): void {
    // Get the Experiment object to determine the platform
    const experiment = window.Experiment;

    // Check if the images are named consistently
    Object.keys(this.collection).forEach(image => {
      if (!this.collection[image].endsWith(image)) {
        consola.warn(`Image '${image}' named inconsistently`);
      }
    });

    if (experiment.getPlatform() === Platforms.Gorilla) {
      // Populate the image collection for Gorilla
      // Grab the Gorilla API from the browser
      const gorilla = window.gorilla;

      // For each of the images from the desktop build, we
      // want to create a new API call to retrieve each from
      // the Gorilla platform
      Object.keys(this.collection).forEach(image => {
        // Generate the new API call
        this.collection[image] = gorilla.stimuliURL(image);
      });
      consola.debug(`All images attached to 'stimuliURL'.`);

      this.isLoaded = true;
    } else {
      consola.debug(`jsPsych only, local images are loaded.`);
      this.isLoaded = true;
    }
  }

  /**
   * Get the image collection
   * @return {{ [x: string]: string }}
   */
  public getCollection(): { [x: string]: string } {
    if (this.isLoaded) {
      // Return the collection if loaded images
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
   * Get the path to an image stored locally or remotely
   * @param {string} image the key used to reference the image
   * @return {string}
   */
  public getImage(image: string): string {
    consola.debug(`'getImage' called for image:`, image);
    if (Object.keys(this.collection).includes(image)) {
      // Check that the image exists
      return this.collection[image];
    } else {
      consola.error(new Error(`Image '${image}' not found!`));
      return '';
    }
  }
}
