import dedent from "dedent";
import { describe } from "vitest";

import { runTests } from "./utils";

describe("frontmatter", () => {
  runTests({
    newline: dedent`
    ::component
    ---
    asf: a
    ---

    foo
    ::
  `,
  });
});
