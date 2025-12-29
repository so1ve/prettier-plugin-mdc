import { format } from "prettier";
import { expect, it } from "vitest";

import { AST_FORMAT } from "../src/constants";

interface TestCase {
	markdown: string;
	expected?: string;
}

export function runTests(cases: Record<string, TestCase>) {
	for (const [name, input] of Object.entries(cases)) {
		it(`formats case #${name}`, async () => {
			const formatted = await format(input.markdown, {
				plugins: ["./dist/index.js"],
				filepath: "test.md",
				parser: AST_FORMAT,
			});

			if (input.expected) {
				expect(formatted).toEqual(input.expected);
			} else {
				expect(formatted).toMatchSnapshot();
			}
		});
	}
}
