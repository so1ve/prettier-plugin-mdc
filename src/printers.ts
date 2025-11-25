import type { Printer } from "prettier";
import * as markdown from "prettier/plugins/markdown";
import remarkGfm from "remark-gfm";
import remarkMdc from "remark-mdc";
import remarkStringify from "remark-stringify";
import { unified } from "unified";
import type { Node } from "unist";

import { shouldProcess } from "./utils";
import type { MDCNodeTypes } from "./visitor-keys";
import { mdcNodeTypes, visitorKeys } from "./visitor-keys";

// @ts-expect-error -- does not provide public exports
const mdastPrinter: Printer = markdown.printers.mdast;

export const printers = {
	mdc: {
		...mdastPrinter,
		getVisitorKeys(node, nonTraversableKeys) {
			if (mdcNodeTypes.includes(node.type)) {
				return visitorKeys[node.type as MDCNodeTypes];
			}

			return mdastPrinter.getVisitorKeys!(node, nonTraversableKeys);
		},
		print(path, options, print, args) {
			const { node } = path;

			const stream = unified()
				.use(remarkGfm)
				.use(remarkMdc)
				.use(remarkStringify, {
					bullet: "-",
					emphasis: "_",
					listItemIndent: "one",
					fence: "`",
					fences: true,
					rule: "-",
				});

			if (shouldProcess(node)) {
				// TODO: implement proper printing
				// return stream.stringify(node as any);
				return options.originalText.slice(
					node.position!.start.offset,
					node.position!.end.offset,
				);
			}

			return mdastPrinter.print(path, options, print, args);
		},
	} as Printer<Node>,
};
