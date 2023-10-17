import { Stimuli } from "../../src/api/Stimuli/index";

describe("\"Stimuli\" class initialisation", () => {
  let windowSpy: any;

  beforeEach(() => {
    // Mock the Gorilla implementation attached to the Window
    windowSpy = jest.spyOn(window, "window", "get");
  });

  afterEach(() => {
    // Restore the mocked instance
    windowSpy.mockRestore();
  });

  it("calls the Gorilla functions", () => {
    // Mock the manipulation implementation
    const mockedStimuli = jest.fn();
    windowSpy.mockImplementation(() => ({
      gorilla: {
        stimuliURL: mockedStimuli,
      },
      Experiment: {
        getPlatform: jest.fn(() => {
          return Platforms.Gorilla;
        }),
      },
    }));

    const images = {
      "a.jpg": "/path/a.jpg",
      "b.jpg": "/path/b.jpg",
    };
    const stimuli = new Stimuli(images);

    expect(mockedStimuli).toBeCalledTimes(2);
  });

  it("ignores Gorilla calls when jsPsych", () => {
    // Mock the manipulation implementation
    const mockedStimuli = jest.fn();
    windowSpy.mockImplementation(() => ({
      Experiment: {
        getPlatform: jest.fn(() => {
          return Platforms.jsPsych;
        }),
      },
    }));

    const images = {
      "a.jpg": "/path/a.jpg",
      "b.jpg": "/path/b.jpg",
    };
    const stimuli = new Stimuli(images);

    expect(mockedStimuli).toBeCalledTimes(0);
  });

  it("returns the image collection when loaded", () => {
    // Mock the manipulation implementation
    const mockedStimuli = jest.fn();
    windowSpy.mockImplementation(() => ({
      gorilla: {
        stimuliURL: mockedStimuli,
      },
      Experiment: {
        getPlatform: jest.fn(() => {
          return Platforms.Gorilla;
        }),
      },
    }));

    const images = {
      "a.jpg": "/path/a.jpg",
      "b.jpg": "/path/b.jpg",
    };
    const stimuli = new Stimuli(images);

    expect(mockedStimuli).toBeCalledTimes(2);
    expect(stimuli.getAll()).toEqual(images);
  });
});

describe("\"Stimuli\" class usage", () => {
  let windowSpy: any;

  beforeEach(() => {
    // Mock the Gorilla implementation attached to the Window
    windowSpy = jest.spyOn(window, "window", "get");
  });

  afterEach(() => {
    // Restore the mocked instance
    windowSpy.mockRestore();
  });

  it("retrieves an image", () => {
    // Mock the manipulation implementation
    const mockedStimuli = jest.fn((img) => `/path/${img}`);
    windowSpy.mockImplementation(() => ({
      gorilla: {
        stimuliURL: mockedStimuli,
      },
      Experiment: {
        getPlatform: jest.fn(() => {
          return Platforms.jsPsych;
        }),
      },
    }));

    const images = {
      "a.jpg": "/path/a.jpg",
      "b.jpg": "/path/b.jpg",
    };
    const stimuli = new Stimuli(images);

    expect(mockedStimuli).toBeCalledTimes(2);
    expect(stimuli.getOne("a.jpg")).toEqual("/path/a.jpg");
  });
});
