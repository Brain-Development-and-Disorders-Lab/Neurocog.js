import { clear } from "../src/lib/functions";

// Test 'clear' function
describe("clearing page contents", () => {
  // Setup content for each test
  const dummyContent = document.createElement("body");
  beforeEach(() => {
    dummyContent.appendChild(document.createElement("h1"));
  });

  it("clears children", () => {
    // Clear the content
    clear(dummyContent, false);

    expect(dummyContent.firstChild).toBeNull();
  });
});
