import type { Printer } from "prettier";
import * as markdown from "prettier/plugins/markdown";
import type { Node } from "unist";

import { AST_FORMAT } from "./constants";
import {
	isComponentContainerSectionNode,
	isContainerComponentNode,
	isTextComponentNode,
} from "./is";
import {
	printAttributes,
	printComponentContainerSection,
	printContainerComponent,
	printTextComponent,
} from "./print";
import { hasInlineAttribute } from "./utils";
import type { MDCNodeTypes } from "./visitor-keys";
import { mdcNodeTypes, visitorKeys } from "./visitor-keys";

// @ts-expect-error -- does not provide public exports
const mdastPrinter: Printer = markdown.printers.mdast;

export const printers = {
	[AST_FORMAT]: {
		...mdastPrinter,
		getVisitorKeys(node, nonTraversableKeys) {
			if (mdcNodeTypes.includes(node.type)) {
				return visitorKeys[node.type as MDCNodeTypes];
			}

			return mdastPrinter.getVisitorKeys!(node, nonTraversableKeys);
		},
		print(path, options, print, args) {
			const { node } = path;

			if (hasInlineAttribute(node)) {
				// Let the markdown printer handle the node first, then add attributes
				const printed = mdastPrinter.print(path, options, print, args);

				return [printed, printAttributes(node)];
			}

			if (mdcNodeTypes.includes(node.type)) {
				if (isTextComponentNode(node)) {
					return printTextComponent(path, print);
				} else if (isContainerComponentNode(node)) {
					return printContainerComponent(path, print);
				} else if (isComponentContainerSectionNode(node)) {
					return printComponentContainerSection(path, print);
				} else {
					// Fallback to original text
					return options.originalText.slice(
						node.position!.start.offset,
						node.position!.end.offset,
					);
				}
			}

			return mdastPrinter.print(path, options, print, args);
		},
	} as Printer<Node>,
};
