/**
 * @file 'Networking' class managing the sending and receiving of remote
 * resources. The 'axios' request library is used, and the class is
 * initialised with a URL for the endpoint to request data from.
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

// Logging library
import consola from "consola";

// Request library
import axios from "axios";

/**
 * @summary Networking class used to send and receive data from remote
 * resources.
 */
class Networking {
  // Location of the endpoint receiving requests
  private location: string;

  /**
   * Default constructor
   * @param {string} location default URL of the computing resource
   * @class
   */
  constructor(location: string) {
    this.location = location;
    consola.debug(`Querying URL: ${this.location}`);
  }

  /**
   * Get the URL pointing to the compute resource and
   * its public APIs
   * @return {string}
   */
  public getLocation(): string {
    return this.location;
  }

  /**
   * Update the resource URL
   * @param {string} location the URL to the computing resource
   */
  public setLocation(location: string): void {
    this.location = location;
  }

  /**
   * Send a new request to the resource
   * @param {any} params request parameters
   * @param {function(data: any): void} onSuccess
   * @param {function(data: any): void} onError
   */
  public send(
    params: any,
    onSuccess: (data: any) => void,
    onError: (data: any) => void
  ): void {
    const startTime = performance.now();

    axios
      .get(this.location, { params: params })
      .then((response) => {
        // Attempt to handle the response and extract the data
        if (response["data"]) {
          // Pass the data to the callback
          onSuccess(response.data);
        } else {
          consola.warn("No data received");
        }
      })
      .catch((error) => {
        onError(error);
      })
      .then(() => {
        const endTime = performance.now();
        consola.info(
          `Networking complete after ${Math.round(endTime - startTime)}ms`
        );
      });
  }
}

export default Networking;
