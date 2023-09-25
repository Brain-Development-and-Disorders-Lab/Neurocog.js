// Axios imports
import axios, { AxiosRequestConfig, AxiosResponse } from "axios";

/**
 * Static wrapper class, streamlining usage of the Axios library within an online behavioral experiment.
 */
export class Networking {
  /**
   * Wrapper function providing ability to send a GET request to an external resources
   * @param {string} url destination, target of GET request
   * @param {AxiosRequestConfig} options provide options to configure the Axios request (optional)
   * @return {AxiosResponse}
   */
  static get(url: string, options?: AxiosRequestConfig): Promise<AxiosResponse> {
    return new Promise<AxiosResponse>((resolve, reject) => {
      axios.get(url, options).then((response: AxiosResponse) => {
        resolve(response);
      }).catch((error: any) => {
        reject(error);
      });
    });
  };
};
