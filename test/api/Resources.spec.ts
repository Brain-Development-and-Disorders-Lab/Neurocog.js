import { Resources } from "../../src/api/Resources/index";

describe("\"Resources\" class instantiation", () => {
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
    const mockedResource = jest.fn();
    windowSpy.mockImplementation(() => ({
      gorilla: {
        resourceURL: mockedResource,
      },
    }));

    const resources = new Resources({
      "a.file": "/path/a.file",
      "b.file": "/path/b.file",
    });

    expect(mockedResource).toBeCalledTimes(2);
  });
});

describe("\"Resources\" class usage", () => {
  it("returns one existing Resource", () => {
    const resources = new Resources({
      "a.file": "/path/a.file",
    });

    expect(resources.getOne("a.file")).toBe("/path/a.file");
  });

  it("returns all Resource", () => {
    const resources = new Resources({
      "a.file": "/path/a.file",
      "b.file": "/path/b.file",
    });

    expect(resources.getAll()).toStrictEqual({
      "a.file": "/path/a.file",
      "b.file": "/path/b.file",
    });
  });

  it("returns an empty string if non-existing", () => {
    const resources = new Resources({
      "a.file": "/path/a.file",
    });

    expect(resources.getOne("b.file")).toBe("");
  });
});
