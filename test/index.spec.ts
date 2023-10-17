import { initJsPsych } from "jspsych";

import NeurocogExtension from "../src/index";

describe("\"Neurocog\" initialization with basic parameters", () => {
  it("should pass", () => {
    const jsPsych = initJsPsych({
      extensions: [
        {
          type: NeurocogExtension,
          params: {
            name: "Example Neurocog.js",
            studyName: "example_task",
            stimuli: {},
            resources: {},
            manipulations: {
              a: 1,
            },
            allowParticipantContact: false,
            contact: "henry.burgess@wustl.edu",
          }
        }
      ],
    });
  });
});
