import dedent from "dedent";
import { describe } from "vitest";

import { runTests } from "./utils";

describe("markdown", () => {
  runTests({
    "heading": dedent`
    Hello World
    ---

    #   aasdf
    `,
    "setext-heading": dedent`
    Hello World
    ====

    aa
    ---

    bb
    `,
    "embed": dedent`
    \`\`\`js
    const a    =   1
    \`\`\`
    `,
  });
});
