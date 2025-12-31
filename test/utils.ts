import { format } from "prettier";
import { format as formatDev } from "prettier-dev";
import { expect, it } from "vitest";

import * as prettierPluginMdc from "../src";
import { AST_FORMAT } from "../src/constants";

declare const __TEST_DEV__: boolean;

export function runTests(cases: Record<string, string>) {
  for (const [name, markdown] of Object.entries(cases)) {
    if (__TEST_DEV__) {
      it(`formats case "${name}" (dev)`, async () => {
        const formatted = await formatDev(markdown, {
          plugins: [prettierPluginMdc],
          filepath: "test.md",
          parser: AST_FORMAT,
        });

        expect(formatted).toMatchSnapshot();
      });
    } else {
      it(`formats case "${name}"`, async () => {
        const formatted = await format(markdown, {
          plugins: [prettierPluginMdc],
          filepath: "test.md",
          parser: AST_FORMAT,
        });

        expect(formatted).toMatchSnapshot();
      });
    }
  }
}
