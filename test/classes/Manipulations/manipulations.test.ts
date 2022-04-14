import { Manipulations } from '../../../src/lib/classes/Manipulations';

describe('Manipulations linking', () => {
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
    const mockedManipulation = jest.fn();
    windowSpy.mockImplementation(() => ({
      gorilla: {
        manipulation: mockedManipulation,
      },
    }));

    const manipulations = {
      one: 'one',
      two: 2,
    };

    Manipulations.link(manipulations);
    expect(mockedManipulation).toBeCalledTimes(2);
  });
});
