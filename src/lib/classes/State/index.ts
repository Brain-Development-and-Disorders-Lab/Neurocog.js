// Logging library
import consola from 'consola';

/**
 * State management class to maintain variables globally
 * outside of the main experiment
 */
export class State {
  // Current state
  private stateData: any;

  /**
   * Default constructor
   * @param {any} initial optional initial state object
   */
  constructor(initial: any = {}) {
    // Store initial state
    this.stateData = initial;
  }

  /**
   * Get the value of a particular state component
   * @param {string} key state component
   * @return {any | null}
   */
  public get(key: string): any | null {
    if (key in this.stateData) {
      return this.stateData[key];
    } else {
      consola.error(new Error(`State component '${key}' not found`));
      return null;
    }
  }

  /**
   * Set the value of a particular state component
   * @param {string} key state component
   * @param {any} value state component value
   */
  public set(key: string, value: any): void {
    // Need to check that the value is defined first,
    // storing 'undefined' as a state is never a good idea
    if (typeof value !== 'undefined') {
      // Go ahead and check that the key currently exists
      if (key in this.stateData) {
        // Update the value if so
        this.stateData[key] = value;
      } else {
        // Otherwise, warn that it was not initialised.
        // State components should not be added along the way,
        // they should at least be initialised.
        consola.warn(
          `State component '${key}' initialised after experiment start`
        );
        this.stateData[key] = value;
      }
    } else {
      // Log an error
      consola.error(new Error(`State component value must be defined`));
    }
  }
}
