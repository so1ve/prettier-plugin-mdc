import dedent from "dedent";
import { describe } from "vitest";

import { runTests } from "./utils";

describe("markdown", () => {
  runTests({
    heading: dedent`
    Hello World
    ---

    #   aasdf
    `,
  });
});
