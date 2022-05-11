import { Manipulations } from "../../../src/lib/classes/Manipulations";

describe("Manipulations linking", () => {
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
    const mockedManipulation = jest.fn();
    windowSpy.mockImplementation(() => ({
      gorilla: {
        manipulation: mockedManipulation,
      },
    }));

    const manipulations = {
      one: "one",
      two: 2,
    };

    Manipulations.link(manipulations);
    expect(mockedManipulation).toBeCalledTimes(2);
  });

  it("correctly links Boolean manipulations", () => {
    // Mock the manipulation implementation
    // In Gorilla, everything seems to be a string if not a number
    const mockedManipulation = jest.fn();

    // Return 'false' then 'true', given manipulations hold those values when
    // accessed consecutively
    mockedManipulation.mockReturnValueOnce('false').mockReturnValueOnce('true');

    windowSpy.mockImplementation(() => ({
      gorilla: {
        manipulation: mockedManipulation,
      },
    }));

    const manipulations = {
      one: false,
      two: true,
    };

    Manipulations.link(manipulations);
    expect(mockedManipulation).toBeCalledTimes(2);

    // Expect type to be preserved if Boolean
    expect(manipulations.one).toBe(false);
    expect(manipulations.two).toBe(true);
  });
});
