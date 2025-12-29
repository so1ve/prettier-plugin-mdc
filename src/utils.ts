import type { Options } from "prettier";
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

export const extendedInlineNodesHaveAttributes = (
  node: Node,
): node is NodeWithAttributes =>
  extendedInlineNodes.includes(node.type) && "attributes" in node;

export const shouldProcess = (node: Node): boolean =>
  extendedInlineNodesHaveAttributes(node) || mdcNodeTypes.includes(node.type);

export const escapeQuotes = (value: string, quote: string): string =>
  value.replace(new RegExp(quote, "g"), `\\${quote}`);

/**
 * Quote a string value using Prettier's quote selection logic:
 * - Use preferred quote if value doesn't contain it
 * - Switch to alternative quote if value contains preferred but not alternative
 * - Use preferred quote with escaping if value contains both
 */
export function quoteString(value: string, options: Options): string {
  const preferredQuote = options.singleQuote ? "'" : '"';
  const alternativeQuote = options.singleQuote ? '"' : "'";

  const hasPreferred = value.includes(preferredQuote);
  const hasAlternative = value.includes(alternativeQuote);

  const quote =
    hasPreferred && !hasAlternative ? alternativeQuote : preferredQuote;
  const escaped = escapeQuotes(value.replace(/\\/g, "\\\\"), quote);

  return `${quote}${escaped}${quote}`;
}
