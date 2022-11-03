import { Stimuli } from "../../../src/api/Stimuli";
import { Environments } from "../../../src/constants";

describe("Stimuli loading", () => {
  let windowSpy: any;

  // Mock the manipulation implementation
  const mockedStimuli = jest.fn();

  beforeEach(() => {
    // Mock the Gorilla implementation attached to the Window
    windowSpy = jest.spyOn(window, "window", "get");
    windowSpy.mockImplementation(() => ({
      gorilla: {
        stimuliURL: mockedStimuli,
      },
      Neurocog: {
        getEnvironment: jest.fn(() => {
          return Environments.Gorilla;
        }),
      },
    }));
  });

  afterEach(() => {
    // Restore the mocked instance
    windowSpy.mockRestore();
    mockedStimuli.mockClear();
  });

  it("calls the Gorilla functions", () => {
    const images = {
      "a.jpg": "/path/a.jpg",
      "b.jpg": "/path/b.jpg",
    };

    new Stimuli(images);

    expect(mockedStimuli).toBeCalledTimes(2);
  });

  it("ignores Gorilla calls when jsPsych", () => {
    // Specific window implementation for this test
    windowSpy.mockImplementation(() => ({
      gorilla: {
        stimuliURL: mockedStimuli,
      },
      Neurocog: {
        getEnvironment: jest.fn(() => {
          return Environments.jsPsych;
        }),
      },
    }));

    const images = {
      "a.jpg": "/path/a.jpg",
      "b.jpg": "/path/b.jpg",
    };

    new Stimuli(images);

    expect(mockedStimuli).toBeCalledTimes(0);
  });

  it("returns empty if not loaded", () => {
    const images = {
      "a.jpg": "/path/a.jpg",
      "b.jpg": "/path/b.jpg",
    };

    const stimuli = new Stimuli(images);
    expect(stimuli.getAll()).toEqual({});
  });

  it("returns the image collection when loaded", () => {
    const images = {
      "a.jpg": "/path/a.jpg",
      "b.jpg": "/path/b.jpg",
    };

    const stimuli = new Stimuli(images);

    expect(mockedStimuli).toBeCalledTimes(2);
    expect(stimuli.getAll()).toEqual(images);
  });
});

describe("Stimuli get image", () => {
  let windowSpy: any;

  // Mock the manipulation implementation
  const mockedStimuli = jest.fn();

  beforeEach(() => {
    // Mock the Gorilla implementation attached to the Window
    windowSpy = jest.spyOn(window, "window", "get");
    windowSpy.mockImplementation(() => ({
      gorilla: {
        stimuliURL: mockedStimuli,
      },
      Neurocog: {
        getEnvironment: jest.fn(() => {
          return Environments.jsPsych;
        }),
      },
    }));
  });

  afterEach(() => {
    // Restore the mocked instance
    windowSpy.mockRestore();
    mockedStimuli.mockClear();
  });

  it("retrieves an image", () => {

    const images = {
      "a.jpg": "/path/a.jpg",
      "b.jpg": "/path/b.jpg",
    };

    const stimuli = new Stimuli(images);

    expect(mockedStimuli).toBeCalledTimes(0);
    expect(stimuli.get("a.jpg")).toEqual("/path/a.jpg");
  });
});
