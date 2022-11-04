import { State } from "../../../src/lib/State";

describe("State initialisation", () => {
  it("works with no arguments", () => {
    new State();
  });

  it("works with empty object", () => {
    new State({});
  });

  it("works with non-empty object", () => {
    const state = new State({
      count: 0,
    });

    expect(state.get("count")).toBe(0);
  });
});

describe("State modification", () => {
  it("increments a counter", () => {
    const state = new State({
      count: 0,
    });

    state.set("count", state.get("count") + 1);

    expect(state.get("count")).toBe(1);
  });

  it("modifies a string", () => {
    const state = new State({
      message: "hello",
    });

    state.set("message", "hello world");

    expect(state.get("message")).toBe("hello world");
  });

  it("modifies an object", () => {
    const state = new State({
      data: {
        count: 0,
      },
    });
    const data = state.get("data");
    expect(data.count).toBe(0);

    // Update count
    data.count = data.count + 1;
    state.set("data", data);

    expect(state.get("data")["count"]).toBe(1);
  });

  it("changes types", () => {
    const state = new State({
      data: "hello",
    });
    expect(typeof state.get("data")).toBe("string");

    state.set("data", 0);

    expect(typeof state.get("data")).toBe("number");
  });
});

describe("State instance", () => {
  it("can specify values after initialisation", () => {
    const state = new State();

    state.set("count", 0);
    expect(state.get("count")).toBe(0);
  });

  it("does not allow undefined values", () => {
    const state = new State({
      message: "hello",
    });

    expect(state.set("message", undefined)).toBeUndefined();
  });
});
