// Logging library
import consola from 'consola';

/**
 * Class that links to the Gorilla Manipulations API. It allows safe references
 * to the API while developing the tasks locally.
 */
export class Manipulations {
  // Target object containing the manipulations
  private manipulations: { [manipulation: string]: any };

  /**
   * Default constructor
   * @param {any} manipulations target object containing the manipulations
   * @param {string[]} _keys list of manipulation keys
   */
  constructor(manipulations: { [manipulation: string]: any }) {
    this.manipulations = manipulations;
    this.bind();
  }

  /**
   * Retrieves the Gorilla instance and connects any manipulations specified
   * to the Gorilla Manipulations API.
   */
  private bind() {
    const gorilla = window.Gorilla;
    Object.keys(this.manipulations).forEach(key => {
      if (this.manipulations[key]) {
        // Type checks to make sure properties are preserved
        if (this.manipulations[key] instanceof Number) {
          // Number
          this.manipulations[key] = Number(gorilla.manipulation(key));
        } else if (this.manipulations[key] instanceof Boolean) {
          // Boolean
          this.manipulations[key] = gorilla.manipulation(key) == 'true';
        } else {
          // Everything else (strings etc.)
          this.manipulations[key] = gorilla.manipulation(key);
        }
      } else {
        consola.warn(`Manipulation '${key}' was not bound`);
      }
    });
  }
}
