// Logging library
import consola from 'consola';

/**
 * Scaling function to automatically resize and scale content
 */
export function scale(): void {
  const wrapper = document.querySelector(
    '.jspsych-content-wrapper'
  ) as HTMLElement;
  const content = document.querySelector('.jspsych-content') as HTMLElement;

  if (content) {
    // Apply the CSS transform using the scale() function
    content.style.width = `${Math.max(
      content.clientWidth,
      wrapper.clientWidth
    )}px`;
  }
}

/**
 * Clear the HTML contents of an element without
 * editing innerHTML.
 * @param {HTMLElement} target element to clear contents
 */
export function clear(target: HTMLElement): void {
  // Clear existing HTML nodes
  while (target.firstChild) {
    target.removeChild(target.lastChild as Node);
  }
}


/**
 * Important utility function used to enforce loading the script with
 * the 'defer' attribute set correctly on Gorilla.
 */
export function checkContext(): boolean {
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
          `Missing 'defer' attribute, Gorilla functionality will not work! ` +
          `Add the 'defer' attribute to the <script> element to resolve this error`
      );

      // Context check didn't pass
      status = false;
    } else if (contextErrors.gorilla === false && contextErrors.defer === false) {
      // 'defer' was not specified, but not required
      consola.warn(
          `<script> missing 'defer' attribute`
      );
    } else {
      // No issues found
      consola.info(`No context issues found`);
    }
  } else {
    // Log a warning
    consola.warn(`Context not checked`);
  }

  return status;
}
