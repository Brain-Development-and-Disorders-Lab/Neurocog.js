import { clear, clearTimeouts } from "../../../functions";

/**
 * Global error-handling class
 */
export class ErrorHandler {
  private config: Configuration;

  constructor(config: Configuration) {
    this.config = config;
    this.setup();
  }

  private setup() {
    window.addEventListener('error', this.invoke.bind(this));
  }

  public invoke(error: Error | ErrorEvent) {
    const target = document.getElementById('jspsych-content');
    clearTimeouts(10000);
    clear(target, true);

    // Apply global styling
    document.body.style.fontFamily = 'Open Sans';
    document.body.style.textAlign = 'center';

    // Container for elements
    const container = document.createElement('div');

    // Heading text
    const heading = document.createElement('h1');
    heading.textContent = 'Oh no!';

    // Subheading
    const subheading = document.createElement('h2');
    subheading.textContent = 'It looks like an error has occurred.';

    // Container for the error information
    const errorContainer = document.createElement('div');
    errorContainer.style.margin = '20px';

    // 'Error description:' text
    const textIntroduction = document.createElement('p');
    textIntroduction.textContent = 'Error description:';

    // Error description
    const description = document.createElement('code');
    description.innerText = error.message;
    description.style.gap = '20rem';
    errorContainer.append(textIntroduction, description);

    // Follow-up instructions
    const textInstructions = document.createElement('p');
    if (this.config.allowParticipantContact === true) {
      textInstructions.innerHTML =
        `Please send an email to ` +
        `<a href="mailto:${this.config.contact}?` +
        `subject=Error (${this.config.studyName})` +
        `&body=Error text: ${error.message}%0D%0A Additional information:"` +
        `>${this.config.contact}</a> to share ` +
        `the details of this error.`;
      textInstructions.style.margin = '20px';
    }

    // Button to end the experiment
    const endButton = document.createElement('button');
    endButton.textContent = 'End Experiment';
    endButton.classList.add('jspsych-btn');
    endButton.onclick = () => {
      // End the experiment and provide an error message
      window.jsPsych.endExperiment(
        'The experiment ended early due to an error occurring.'
      );
    };

    // Replace the content of the document.body
    if (target) {
      // Populate the container
      container.append(
        heading,
        subheading,
        errorContainer,
        textInstructions,
        endButton
      );

      // Update the styling of the target
      target.style.display = 'flex';
      target.style.justifyContent = 'center';
      target.append(container);
    }
  }
}