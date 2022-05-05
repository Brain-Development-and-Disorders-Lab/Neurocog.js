// Logging library
import consola from "consola";

/**
 * @summary Class that links to the Gorilla API 'Resources'. It allows
 * safe references to the API while developing the tasks locally.
 */
export class Resources {
  /**
   * Retrieves the Gorilla instance and connects any resources specified
   * to the Gorilla API 'Resources'.
   * @param {{ [resource: string]: any }} resources target object containing
   * the resources
   */
  public static link(resources: { [resource: string]: any }) {
    const gorilla = window.gorilla;
    Object.keys(resources).forEach((key) => {
      if (resources[key]) {
        resources[key] = gorilla.resourceURL(key);
      } else {
        consola.warn(`Resource '${key}' was not bound`);
      }
    });
  }
}
