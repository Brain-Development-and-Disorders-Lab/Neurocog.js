// Utility functions and libraries
import { isPlatform } from "src/util";
import consola from "consola";

// ICollection interface
import { ICollection } from "../ICollection";

/**
 * @summary Utility class to load Resources and setup any API calls if required
 */
export class Resources implements ICollection {
  private collection: { [x: string]: string };
  private isLinked: boolean;

  /**
   * Default constructor
   * @param {any} collection images to load and manage
   * @class
   */
  constructor(collection: { [x: string]: string }) {
    this.collection = collection;
    this.isLinked = false;

    // Link stimuli to Gorilla API functions if required
    this.link();
    consola.debug(`Created new "Resources" instance with ${Object.keys(collection).length} Resources`);
  }

  /**
   * Linking method for the resource collection
   */
  private link(): void {
    // Check if the resources are named consistently
    Object.keys(this.collection).forEach((image) => {
      if (!this.collection[image].endsWith(image)) {
        consola.warn(`Resource "${image}" named inconsistently`);
      }
    });

    if (isPlatform()) {
      // Populate the resource collection for Gorilla
      // Grab the Gorilla API from the browser
      const gorilla: GorillaAPI = window["gorilla"];

      // For each of the resources from the desktop build, we
      // want to create a new API call to retrieve each from
      // the Gorilla platform
      Object.keys(this.collection).forEach((resource) => {
        // Generate the new API call
        this.collection[resource] = gorilla.resourceURL(resource);
      });
    }
    this.isLinked = true;
  }

  /**
   * Get the Resource collection
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
        `Resource collection not loaded before accessing! ` +
          `Ensure "link()" has been called.`
      )
    );
    return {};
  }

  /**
   * Get the path to a resource stored locally or remotely
   * @param {string} resource the key used to reference the resource
   * @return {string}
   */
  public getOne(resource: string): string {
    consola.debug(`"getOne" called for Resource:`, resource);
    if (Object.keys(this.collection).includes(resource)) {
      // Check that the resource exists
      return this.collection[resource];
    } else {
      consola.error(new Error(`Resource "${resource}" not found!`));
      return "";
    }
  }
}
