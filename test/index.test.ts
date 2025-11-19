import dedent from "dedent";
import { format } from "prettier";
import { describe, expect, it } from "vitest";

// TODO

describe("should", () => {
	it("sort", async () => {
		await expect(
			format(
				dedent`
					aaaa
					----

					::component
					---
					a: 1
					---
					::
				`,
				{
					plugins: ["./dist/index.js"],
					filepath: "test.md",
				},
			),
		).resolves.toMatchSnapshot();
	});
});
