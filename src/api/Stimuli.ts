// Imports
import {PLATFORMS} from '../Constants';
import {Experiment} from '../Experiment';

// Logging library
import consola from 'consola';

/**
 * Utility class to load images and setup any API calls if required
 */
export class Stimuli {
  private collection: { [x: string]: any };
  private isLoaded: boolean;

  /**
   * Default constructor
   * @param {any} collection images to load and manage
   */
  constructor(collection: { [x: string]: any }) {
    this.collection = collection;
    this.isLoaded = false;
  }

  /**
   * Loader method for the ImageCollection
   */
  public load(): void {
    // Get the Experiment object to determine the platform
    const experiment = window['Experiment'] as Experiment;
    if (experiment.getPlatform() === PLATFORMS.GORILLA) {
      // Populate the image collection for Gorilla
      // Grab the Gorilla API from the browser
      const gorilla = window['gorilla'] as Gorilla;

      // For each of the images from the desktop build, we
      // want to create a new API call to retrieve each from
      // the Gorilla platform
      Object.keys(this.collection).forEach((image) => {
        // Generate the new API call
        this.collection[image] = gorilla.stimuliURL(image);
      });

      this.isLoaded = true;
    }
  }

  /**
   * Get the image collection
   * @return {any}
   */
  public getCollection(): { [x: string]: any; } {
    if (this.isLoaded) {
      // Return the collection if loaded images
      return this.collection;
    }

    // Raise error and return empty if not loaded yet
    consola.error(
        `Image collection not loaded before accessing! ` +
        `Ensure 'load()' has been called.`
    );
    return {};
  }
}
