import { describe } from "vitest";

import { runTests } from "./utils";

describe("inline-component", () => {
  runTests({
    "dummy-props": "How to say :hello{}-world in Markdown",
  });
});
