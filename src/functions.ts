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
 * @param {HTMLElement} _target element to clear contents
 */
export function clear(_target: HTMLElement): void {
  // Clear existing HTML nodes
  while (_target.firstChild) {
    _target.removeChild(_target.lastChild as Node);
  }
}
