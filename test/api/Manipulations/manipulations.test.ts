import { Manipulations } from "../../../src/api/Manipulations";
import { Environments } from "../../../src/constants";

describe("Manipulations linking", () => {
  let windowSpy: any;

  // Mock the manipulation implementation
  const mockedManipulation = jest.fn();

  beforeEach(() => {
    // Mock the Gorilla implementation attached to the Window
    windowSpy = jest.spyOn(window, "window", "get");

    windowSpy.mockImplementation(() => ({
      gorilla: {
        manipulation: mockedManipulation,
      },
      Neurocog: {
        getEnvironment: jest.fn(() => {
          return Environments.Gorilla;
        }),
      },
    }));
  });

  afterEach(() => {
    // Reset window mock and function mocks
    windowSpy.mockRestore();
    mockedManipulation.mockClear();
  });

  it("calls the Gorilla functions", () => {
    mockedManipulation.mockReturnValueOnce("one").mockReturnValueOnce(2);

    const variables = {
      one: "one",
      two: 2,
    };

    new Manipulations(variables);

    expect(mockedManipulation).toBeCalledTimes(2);
  });

  it("correctly links Boolean manipulations", () => {
    // Return 'false' then 'true', given manipulations hold those values when
    // accessed consecutively
    mockedManipulation.mockReturnValueOnce("false").mockReturnValueOnce("true");

    const variables = {
      one: false,
      two: true,
    };

    const manipulations = new Manipulations(variables);

    expect(manipulations.get("one")).toBe(false);
    expect(manipulations.get("two")).toBe(true);
  });

  it("correctly links numerical manipulations", () => {
    mockedManipulation.mockReturnValueOnce(1);

    const variables = {
      one: 1,
    };

    const manipulations = new Manipulations(variables);

    expect(manipulations.get("one")).toBe(1);
  });

  it("returns all manipulations", () => {
    mockedManipulation.mockReturnValueOnce(1);

    const variables = {
      one: 1,
    };

    const manipulations = new Manipulations(variables);

    expect(manipulations.getAll()).toEqual(variables);
  });
});
