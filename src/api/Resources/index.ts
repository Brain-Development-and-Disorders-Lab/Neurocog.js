// Interfaces
import { APIFeature } from "../APIFeature";

// Logging library
import consola from "consola";
import { Environments } from "../../constants";

/**
 * @summary Class that links to the Gorilla API 'Resources'. It allows
 * safe references to the API while developing the tasks locally.
 */
export class Resources implements APIFeature {
  private resources:  { [resource: string]: any };

  constructor(resources: { [resource: string]: any }) {
    this.resources = resources;

    // Get the Neurocog object to determine the platform
    const Neurocog = window.Neurocog;

    // Run setup if on the Gorilla platform
    if (Neurocog.getEnvironment() === Environments.Gorilla) {
      this.setup();
    }
  }

  /**
   * Retrieves the Gorilla instance and connects any resources specified
   * to the Gorilla API 'Resources'.
   * @param {{ [resource: string]: any }} resources target object containing
   * the resources
   */
  private setup() {
    const gorilla = window.gorilla;
    Object.keys(this.resources).forEach((key) => {
      if (this.resources[key]) {
        this.resources[key] = gorilla.resourceURL(key);
      } else {
        consola.warn(`Resource '${key}' was not bound`);
      }
    });
  }

  public get(resource: string): any {
    return this.resources[resource];
  }

  public getAll(): any {
    return this.resources;
  }
}
