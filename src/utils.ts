import type { Node } from "unist";

import { mdcNodeTypes } from "./visitor-keys";

const extendedInlineNodes = [
	"image",
	"link",
	"linkReference",
	"strong",
	"inlineCode",
	"emphasis",
];

const hasInlineAttribute = (
	node: Node,
): node is Node & { attributes: Record<string, any> } =>
	extendedInlineNodes.includes(node.type) && "attributes" in node;

export const shouldProcess = (node: Node) =>
	hasInlineAttribute(node) || mdcNodeTypes.includes(node.type);
