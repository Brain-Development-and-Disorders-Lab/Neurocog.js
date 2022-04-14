import { Stimuli } from '../../../src/lib/classes/Stimuli';
import { Platforms } from '../../../src/lib/constants';

describe('Stimuli loading', () => {
  let windowSpy: any;

  beforeEach(() => {
    // Mock the Gorilla implementation attached to the Window
    windowSpy = jest.spyOn(window, 'window', 'get');
  });

  afterEach(() => {
    // Restore the mocked instance
    windowSpy.mockRestore();
  });

  it('calls the Gorilla functions', () => {
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
      'a.jpg': '/path/a.jpg',
      'b.jpg': '/path/b.jpg',
    };

    const stimuli = new Stimuli(images);

    stimuli.load();
    expect(mockedStimuli).toBeCalledTimes(2);
  });

  it('ignores Gorilla calls when jsPsych', () => {
    // Mock the manipulation implementation
    const mockedStimuli = jest.fn();
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
      'a.jpg': '/path/a.jpg',
      'b.jpg': '/path/b.jpg',
    };

    const stimuli = new Stimuli(images);

    stimuli.load();
    expect(mockedStimuli).toBeCalledTimes(0);
  });

  it('returns empty if not loaded', () => {
    const images = {
      'a.jpg': '/path/a.jpg',
      'b.jpg': '/path/b.jpg',
    };

    const stimuli = new Stimuli(images);
    expect(stimuli.getCollection()).toEqual({});
  });

  it('returns the image collection when loaded', () => {
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
      'a.jpg': '/path/a.jpg',
      'b.jpg': '/path/b.jpg',
    };

    const stimuli = new Stimuli(images);

    stimuli.load();
    expect(mockedStimuli).toBeCalledTimes(2);
    expect(stimuli.getCollection()).toEqual(images);
  });
});

describe('Stimuli get image', () => {
  let windowSpy: any;

  beforeEach(() => {
    // Mock the Gorilla implementation attached to the Window
    windowSpy = jest.spyOn(window, 'window', 'get');
  });

  afterEach(() => {
    // Restore the mocked instance
    windowSpy.mockRestore();
  });

  it('retrieves an image', () => {
    // Mock the manipulation implementation
    const mockedStimuli = jest.fn();
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
      'a.jpg': '/path/a.jpg',
      'b.jpg': '/path/b.jpg',
    };

    const stimuli = new Stimuli(images);

    stimuli.load();
    expect(mockedStimuli).toBeCalledTimes(0);
    expect(stimuli.getImage('a.jpg')).toEqual('/path/a.jpg');
  });
});
