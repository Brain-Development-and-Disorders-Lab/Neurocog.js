// Logging library
import consola from "consola";
import { Environments } from "../../constants";
import { APIFeature } from "../APIFeature";

/**
 * @summary Class that links to the Gorilla Manipulations API. It allows
 * safe references to the API while developing the tasks locally.
 */
export class Manipulations implements APIFeature {
  // Set of experimental variables or manipulations
  private manipulations: { [manipulation: string]: any };

  /**
   * Default constructor
   * @param {{ [manipulation: string]: any }} manipulations set of experimental
   * variables or manipulations
   * @class
   */
  constructor(manipulations: { [manipulation: string]: any }) {
    this.manipulations = manipulations;

    // Get the Neurocog object to determine the platform
    const Neurocog = window.Neurocog;

    // Run setup if on the Gorilla platform
    if (Neurocog.getEnvironment() === Environments.Gorilla) {
      this.setup();
    }
  }

  /**
   * Retrieves the Gorilla instance and connects any manipulations specified
   * to the Gorilla Manipulations API.
   * @param {{ [manipulation: string]: any }} manipulations target object
   * containing the manipulations
   */
  private setup() {
    const gorilla = window.gorilla;
    Object.keys(this.manipulations).forEach((key) => {
      if (this.manipulations[key] !== undefined) {
        // Type checks to make sure properties are preserved
        if (this.manipulations[key] instanceof Number) {
          // Number
          this.manipulations[key] = Number(gorilla.manipulation(key));
        } else if (
          this.manipulations[key] === true ||
          this.manipulations[key] === false
        ) {
          // Boolean
          this.manipulations[key] = gorilla.manipulation(key) === "true";
        } else {
          // Everything else (strings etc.)
          this.manipulations[key] = gorilla.manipulation(key);
        }
      } else {
        consola.warn(`Manipulation '${key}' was not bound`);
      }
    });
  }

  /**
   * Get the value of a specific manipulation
   * @param {string} identifier key identifying the manipulation
   * @return {any} value of the manipulation if defined
   */
  public get(identifier: string): any {
    consola.info(this.manipulations[identifier]);
    // Check if value is defined
    if (this.manipulations[identifier] !== undefined) {
      return this.manipulations[identifier];
    } else {
      consola.error(new Error(`Manipulation '${identifier}' is undefined`));
      return null;
    }
  }

  /**
   * Get the entire collection of Manipulations
   * @return {{ [manipulation: string]: any }}
   */
  public getAll(): { [manipulation: string]: any } {
    return this.manipulations;
  }
}
