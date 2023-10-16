// Logging library
import consola from "consola";

/**
 * Clear the HTML contents of an element without
 * editing innerHTML.
 * @param {HTMLElement} target element to clear contents
 * is required for React content
 */
export const clearView = (target: HTMLElement | null): void => {
  if (target) {
    consola.debug(`Target is defined, clearing...`);

    // Clear existing HTML nodes
    while (target.firstChild) {
      target.removeChild(target.lastChild as Node);
    }
    consola.debug(`Cleared HTML nodes from target`);
  } else {
    consola.warn(`Target not found`);
  }
};

/**
 * Clear a range of timeouts
 * @param {number[]} timeouts the range of timeouts to clear
 */
export const clearTimeouts = (timeouts?: number[]): void => {
  if (timeouts) {
    // Array type
    for (let i of timeouts) {
      clearTimeout(i);
    }
  } else {
    // Determine the range of timeouts
    const id = window.setTimeout(() => {}, 0);

    for (let i = id; i >= 0; i--) {
      // Clear all prior timeouts
      clearTimeout(i);
    }
  }
};

/**
 * Evaluate if the task is operating in a context with access to the
 * Gorilla API platform
 * @return {boolean}
 */
export const isPlatform = (): boolean => {
  return "gorilla" in window;
};
