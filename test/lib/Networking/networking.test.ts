import Networking from "../../../src/lib/Networking";

describe("Networking initialisation", () => {
  it("works with location argument", () => {
    new Networking("localhost:8080/test");
  });
});