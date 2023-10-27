/**
 * @description Example jsPsych experiment configuration and timeline utilizing the
 * Neurocog.js jsPsych Extension.
 *
 * @author Henry Burgess <henry.burgess@wustl.edu>
 */

const jsPsych = initJsPsych({
  // Specify extensions when initializing jsPsych
  extensions: [
    {
      type: NeurocogExtension,
      // Specify the required Neurocog.js initialization parameters
      params: {
        name: "Example Neurocog.js",
        studyName: "example_task",
        allowParticipantContact: false,
        contact: "henry.burgess@wustl.edu",
      }
    }
  ],
  on_finish: function() {
    jsPsych.data.displayData();
  }
});

// Configure the experiment timeline, adding two trials
var welcome = {
  type: jsPsychHtmlButtonResponse,
  stimulus: "<p>Click below to begin.</p>",
  choices: ["Start"],
  // Specify the extensions, utilize `NeurocogExtension`
  extensions: [
    {
      type: NeurocogExtension,
    }
  ]
};

var image = {
  type: jsPsychImageButtonResponse,
  stimulus: jsPsych.extensions.Neurocog.getStimulus("mug.jpg"),
  prompt: "Is this a mug?",
  choices: ["Yes", "No"],
  // Specify the extensions, utilize `NeurocogExtension`
  extensions: [
    {
      type: NeurocogExtension,
    }
  ]
};

// Start the experiment
jsPsych.run([welcome, image]);
