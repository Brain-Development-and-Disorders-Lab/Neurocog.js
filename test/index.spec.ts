import { initJsPsych } from "jspsych";

import NeurocogExtension from "../src/index";

describe("\"Neurocog\" initialization with basic parameters", () => {
  it("should pass", () => {
    initJsPsych({
      extensions: [
        {
          type: NeurocogExtension,
          params: {
            name: "Example Neurocog.js",
            studyName: "example_task",
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
