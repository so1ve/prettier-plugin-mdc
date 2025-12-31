import dedent from "dedent";
import { describe } from "vitest";

import { runTests } from "./utils";

describe("frontmatter", () => {
  runTests({
    basic: dedent`
    ---
    title:   ""
    date: ""
    ---
    `,
  });
});
