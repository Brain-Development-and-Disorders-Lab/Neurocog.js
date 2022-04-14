// React imports
import ReactDOM from 'react-dom';

// Logging library
import consola from 'consola';

/**
 * Clear the HTML contents of an element without
 * editing innerHTML.
 * @param {HTMLElement} target element to clear contents
 * @param {boolean} isReact specify if additiona clearing
 * is required for React content
 */
export const clear = (target: HTMLElement | null, isReact: boolean = false): void => {
  if (target) {
    consola.debug(`Target is defined, clearing...`);
    if (isReact) {
      // Note: this is for React < v18
      consola.debug(`React-based target, unmounting...`);
      ReactDOM.unmountComponentAtNode(target);
    }

    // Clear existing HTML nodes
    while (target.firstChild) {
      target.removeChild(target.lastChild as Node);
    }
    consola.debug(`Cleared HTML nodes from target`);
  } else {
    consola.warn(`Target was not cleared, target not found`);
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
 * Important utility function used to enforce loading the script with
 * the 'defer' attribute set correctly on Gorilla.
 */
export const checkContext = (): boolean => {
  // Get the current script
  const scriptElement = document.currentScript;

  // Status flag
  let status = true;

  // Collect a list of potential errors
  const contextErrors = {
    defer: false,
    gorilla: false,
  };

  // Run checks on how the script was loaded
  if (scriptElement !== null) {
    // Check 1: was the 'defer' flag set?
    contextErrors.defer = (scriptElement as HTMLScriptElement).defer;

    // Check 2: check if we are running on Gorilla? This check doesn't need
    // to check for the API, we just check the current window location.
    contextErrors.gorilla = window.location.href.includes('gorilla');

    // Generate any error messages
    if (contextErrors.gorilla === true && contextErrors.defer === false) {
      // 'defer' was not specified when required
      consola.error(
        new Error(
          `Missing 'defer' attribute, Gorilla functionality will not work! ` +
            `Add the 'defer' attribute to the <script> element to resolve this error`
        )
      );

      // Context check didn't pass
      status = false;
    } else if (
      contextErrors.gorilla === false &&
      contextErrors.defer === false
    ) {
      // 'defer' was not specified, but not required
      consola.warn(`Script element missing 'defer' attribute`);
    } else {
      // No issues found
      consola.success(`No context issues`);
    }
  } else {
    // Log a warning
    consola.warn(`Context not checked`);
  }

  return status;
};
