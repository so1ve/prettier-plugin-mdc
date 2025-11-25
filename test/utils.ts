import { format } from "prettier";
import { expect, it } from "vitest";

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
				parser: "mdc",
			});

			if (input.expected) {
				expect(formatted).toEqual(input.expected);
			} else {
				expect(formatted).toMatchSnapshot();
			}
		});
	}
}
