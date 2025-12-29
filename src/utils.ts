import type { Node } from "unist";

import type { NodeWithAttributes } from "./types";
import { mdcNodeTypes } from "./visitor-keys";

const extendedInlineNodes = [
  "image",
  "link",
  "linkReference",
  "strong",
  "inlineCode",
  "emphasis",
];

export const hasInlineAttribute = (node: Node): node is NodeWithAttributes =>
  extendedInlineNodes.includes(node.type) && "attributes" in node;

export const shouldProcess = (node: Node): boolean =>
  hasInlineAttribute(node) || mdcNodeTypes.includes(node.type);

export const escapeQuotes = (value: string, quote: string): string =>
  value.replace(new RegExp(quote, "g"), `\\${quote}`);
