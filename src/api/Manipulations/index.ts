// Utility functions and libraries
import { isPlatform } from "src/util";
import _ from "lodash";
import consola from "consola";

// ICollection interface
import { ICollection } from "../ICollection";

/**
 * @summary Class that links experimental manipulations to the Gorilla API. It allows
 * safe references to the API while developing the tasks locally.
 */
export class Manipulations implements ICollection {
  private collection: { [x: string]: any };
  private isLinked: boolean;

  /**
   * Default constructor
   * @param {any} collection manipulations to load and manage
   * @class
   */
  constructor(collection: { [x: string]: string }) {
    this.collection = collection;
    this.isLinked = false;

    // Link stimuli to Gorilla API functions if required
    this.link();
    consola.debug(`Created new "Manipulations" instance with ${Object.keys(collection).length} Manipulations`);
  }

  /**
   * Retrieves the Gorilla instance and connects any manipulations specified
   * to the Gorilla Manipulations API.
   */
  private link() {
    if (isPlatform()) {
      const gorilla: GorillaAPI = window["gorilla"];
      Object.keys(this.collection).forEach((key) => {
        if (!_.isUndefined(this.collection[key])) {
          // Type checks to make sure properties are preserved
          if (_.isNumber(this.collection[key])) {
            // Number
            this.collection[key] = Number(gorilla.manipulation(key));
          } else if (_.isBoolean(this.collection[key])) {
            // Boolean
            this.collection[key] = gorilla.manipulation(key) === "true";
          } else {
            // Everything else (strings etc.)
            this.collection[key] = gorilla.manipulation(key);
          }
        } else {
          consola.warn(`Manipulation "${key}" was not bound`);
        }
      });
    }
  }

  /**
   * Get the value of a particular Manipulation
   * @param {string} key Manipulation identifier
   * @return {any | null}
   */
  public getOne(key: string): any | null {
    if (key in this.collection) {
      return this.collection[key];
    } else {
      consola.error(new Error(`Manipulation '${key}' not found`));
      return null;
    }
  }

  /**
   * Get all Manipulations
   * @return {{ [manipulation: string]: any }}
   */
  public getAll(): { [manipulation: string]: any } {
    return this.collection;
  }
}
