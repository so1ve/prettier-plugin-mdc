import type { Parser } from "prettier";
import markdown from "prettier/parser-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdc from "remark-mdc";
import remarkParse from "remark-parse";
import { unified } from "unified";
import type { Node } from "unist";

import { AST_FORMAT } from "./constants";

export const parsers = {
	[AST_FORMAT]: {
		...markdown.parsers.markdown,
		astFormat: AST_FORMAT,
		parse: async (text) => {
			const processor = unified()
				.use(remarkParse, {
					commonmark: true,
				})
				.use(remarkMath)
				.use(remarkGfm)
				.use(remarkMdc);

			const ast = await processor.run(processor.parse(text));

			return ast;
		},
	} as Parser<Node>,
};
