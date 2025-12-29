import dedent from "dedent";
import { format } from "prettier";
import { describe, expect, it } from "vitest";

import { AST_FORMAT } from "../src/constants";
import { runTests } from "./utils";

describe("yaml-data", () => {
  runTests({
    "newline": dedent`
    ::component
    ---
    asf: a
    ---

    foo
    ::
  `,
    "with-spaces": dedent`
    ::component
    ---
    asf: a
    ---    

    foo
    ::
  `,
  });

  it('throws error for invalid YAML block in "invalid" case', async () => {
    const input = dedent`
      ::component
      ---
      ::

      foo
    `;

    await expect(
      format(input, {
        plugins: ["./dist/index.mjs"],
        filepath: "test.md",
        parser: AST_FORMAT,
      }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(`
      [Error: Invalid YAML block in component "component" at line 2: YAML block is
          not properly closed]
    `);
  });
});
