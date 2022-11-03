import { Resources } from "../../../src/api/Resources";
import { Environments } from "../../../src/constants";

describe("Resources linking", () => {
  let windowSpy: any;

  // Mock the resource implementation
  const mockedResource = jest.fn();

  beforeEach(() => {
    // Mock the Gorilla implementation attached to the Window
    windowSpy = jest.spyOn(window, "window", "get");

    windowSpy.mockImplementation(() => ({
      gorilla: {
        resourceURL: mockedResource,
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
    mockedResource.mockClear();
  });

  it("calls the Gorilla functions", () => {
    const files = {
      "a.file": "/path/a.file",
      "b.file": "/path/b.file",
    };

    new Resources(files);

    expect(mockedResource).toBeCalledTimes(2);
  });
});
