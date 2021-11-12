// Imports
import {PLATFORMS} from '../../Properties';
import {Experiment} from '../../../Experiment';

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
    if ((window['Experiment'] as Experiment).getPlatform() ===
          PLATFORMS.GORILLA) {
      // Populate the image collection for Gorilla
      // Grab the Gorilla API from the browser
      const _gorilla: any = window['gorilla'];

      // For each of the images from the desktop build, we
      // want to create a new API call to retrieve each from
      // the Gorilla platform
      Object.keys(this.collection).forEach((_image) => {
        // Generate the new API call
        this.collection[_image] = _gorilla.stimuliURL(_image);
      });

      this.isLoaded = true;
    } else {
      consola.info('No need to load images');
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
