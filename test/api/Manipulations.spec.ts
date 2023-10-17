import { Manipulations } from "../../src/api/Manipulations/index";

describe("\"Manipulations\" class instantiation", () => {
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

    const manipulations = new Manipulations({
      one: "one",
      two: 2,
    });

    expect(mockedManipulation).toBeCalledTimes(2);
  });

  it("correctly configures Boolean manipulations", () => {
    // Mock the manipulation implementation
    // In Gorilla, everything seems to be a string if not a number
    const mockedManipulation = jest.fn();

    // Return 'false' then 'true', given manipulations hold those values when
    // accessed consecutively
    mockedManipulation.mockReturnValueOnce("false").mockReturnValueOnce("true");

    windowSpy.mockImplementation(() => ({
      gorilla: {
        manipulation: mockedManipulation,
      },
    }));

    const manipulations = new Manipulations({
      one: false,
      two: true,
    });

    expect(mockedManipulation).toBeCalledTimes(2);

    // Expect type to be preserved if Boolean
    expect(manipulations.getOne("one")).toBe(false);
    expect(manipulations.getOne("two")).toBe(true);
  });
});

describe("\"Manipulations\" class usage", () => {
  it("returns one existing Manipulation", () => {
    const manipulations = new Manipulations({
      one: "a",
    });

    expect(manipulations.getOne("one")).toBe("a");
  });

  it("returns all Manipulations", () => {
    const manipulations = new Manipulations({
      one: "one",
      two: 2,
    });

    expect(manipulations.getAll()).toStrictEqual({ one: "one", two: 2 });
  });

  it("returns null if non-existing", () => {
    const manipulations = new Manipulations({
      yes: true,
    });

    expect(manipulations.getOne("no")).toBeNull();
  });
});
