// Logging library
import consola from "consola";

/**
 * @summary Class that links to the Gorilla Manipulations API. It allows
 * safe references to the API while developing the tasks locally.
 */
export class Manipulations {
  /**
   * Retrieves the Gorilla instance and connects any manipulations specified
   * to the Gorilla Manipulations API.
   * @param {{ [manipulation: string]: any }} manipulations target object
   * containing the manipulations
   */
  public static link(manipulations: { [manipulation: string]: any }) {
    const gorilla = window.gorilla;
    Object.keys(manipulations).forEach((key) => {
      if (manipulations[key] !== undefined) {
        // Type checks to make sure properties are preserved
        if (manipulations[key] instanceof Number) {
          // Number
          manipulations[key] = Number(gorilla.manipulation(key));
        } else if (
          manipulations[key] === true ||
          manipulations[key] === false
        ) {
          // Boolean
          manipulations[key] = gorilla.manipulation(key) === "true";
        } else {
          // Everything else (strings etc.)
          manipulations[key] = gorilla.manipulation(key);
        }
      } else {
        consola.warn(`Manipulation '${key}' was not bound`);
      }
    });
  }
}
