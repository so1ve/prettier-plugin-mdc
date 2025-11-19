import type { Parser } from "prettier";
import markdown from "prettier/parser-markdown";

export const parsers = {
	...markdown.parsers,
	markdown: {
		...markdown.parsers.markdown,
		parse: async (text, options) => {
			// const processor = unified().use(remarkParse).use(remarkMdc);
			// const a = await processor.run(processor.parse(text));
			const ast = await markdown.parsers.markdown.parse(text, options);

			return ast;
		},
	},
} satisfies Record<string, Parser>;

export { printers } from "./printers";
