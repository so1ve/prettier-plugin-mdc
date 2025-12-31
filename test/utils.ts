import { format } from "prettier";
import { format as formatDev } from "prettier-dev";
import { expect, it } from "vitest";

import { AST_FORMAT } from "../src/constants";

export function runTests(cases: Record<string, string>) {
  for (const [name, markdown] of Object.entries(cases)) {
    it(`formats case "${name}"`, async () => {
      const formatted = await format(markdown, {
        plugins: ["./dist/index.mjs"],
        filepath: "test.md",
        parser: AST_FORMAT,
      });

      expect(formatted).toMatchSnapshot();
    });

    it(`formats case "${name}" (dev)`, async () => {
      const formatted = await formatDev(markdown, {
        plugins: ["./dist/index.mjs"],
        filepath: "test.md",
        parser: AST_FORMAT,
      });

      expect(formatted).toMatchSnapshot();
    });
  }
}
