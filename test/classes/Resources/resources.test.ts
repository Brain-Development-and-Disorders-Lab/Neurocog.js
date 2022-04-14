import { Resources } from '../../../src/lib/classes/Resources';

describe('Resources linking', () => {
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
    const mockedResource = jest.fn();
    windowSpy.mockImplementation(() => ({
      gorilla: {
        resourceURL: mockedResource,
      },
    }));

    const resources = {
      'a.file': '/path/a.file',
      'b.file': '/path/b.file',
    };

    Resources.link(resources);
    expect(mockedResource).toBeCalledTimes(2);
  });
});
