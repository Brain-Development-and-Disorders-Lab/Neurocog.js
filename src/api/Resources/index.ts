// Interfaces
import { APIFeature } from "../APIFeature";

// Constants
import { Environments } from "../../constants";

// Logging library
import consola from "consola";

/**
 * @summary Class that links to the Gorilla API 'Resources'. It allows
 * safe references to the API while developing the tasks locally.
 */
export class Resources implements APIFeature {
  // Collection of Resources
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
   * to the Gorilla API 'Resources'
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

  /**
   * Get a specific Resource
   * @param identifier the identifier of the resource to retrieve
   * @return {any}
   */
  public get(identifier: string): any {
    return this.resources[identifier];
  }

  /**
   * Get the collection of Resources
   * @return {{ [resource: string]: any }}
   */
  public getAll(): any {
    return this.resources;
  }
}
