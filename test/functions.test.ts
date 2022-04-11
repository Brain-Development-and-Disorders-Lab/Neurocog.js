import { clear, clearTimeouts } from '../src/lib/functions';

// Configure Jest spy functionality
jest.useFakeTimers();
jest.spyOn(global, 'clearTimeout');

// Test 'clear' function
describe('clearing page contents', () => {
  // Setup content for each test
  const dummyContent = document.createElement('body');
  beforeEach(() => {
    dummyContent.appendChild(document.createElement('h1'));
  });

  it('clears children', () => {
    // Clear the content
    clear(dummyContent, false);

    expect(dummyContent.firstChild).toBeNull();
  });
});

// Test 'clearTimeouts'
describe('clearing timeouts', () => {
  // Note: when using fake timeouts, by default there are two
  // pre-existing timeouts. This is accounted for by expecting
  // two timers to have been set already.
  it('clears all timeouts', () => {
    clearTimeouts();
    expect(clearTimeout).toHaveBeenCalledTimes(2 + 0);
  });

  it('clears a range of timeouts', () => {
    clearTimeouts([1, 2, 3]);
    expect(clearTimeout).toHaveBeenCalledTimes(2 + 3);
  });
});
