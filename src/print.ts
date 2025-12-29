import type { Doc, Options } from "prettier";
import { doc } from "prettier";

import type {
  AstPath,
  ComponentContainerSectionNode,
  ContainerComponentNode,
  LinkNode,
  NodeWithAttributes,
  ParserOptions,
  PrintFn,
  TextComponentNode,
} from "./types";
import { escapeQuotes, quoteString } from "./utils";

const { hardline, join } = doc.builders;

const mapChildren = (path: AstPath<any>, print: PrintFn): Doc[] =>
  path.map(print as any, "children");

function serializeValue(value: unknown, options: Options): string {
  if (typeof value === "string") {
    return quoteString(value, options);
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  // For objects/arrays, use JSON
  const preferredQuote = options.singleQuote ? "'" : '"';
  const escaped = escapeQuotes(JSON.stringify(value), preferredQuote);

  return `${preferredQuote}${escaped}${preferredQuote}`;
}

export function printAttributes(
  { attributes }: NodeWithAttributes,
  options: Options,
): string {
  if (!attributes || Object.keys(attributes).length === 0) {
    return "";
  }

  const parts: string[] = [];

  for (const [key, value] of Object.entries(attributes)) {
    if (key === "id") {
      parts.push(`#${value}`);
    } else if (key === "class") {
      const classes = String(value).split(/\s+/).filter(Boolean);
      for (const cls of classes) {
        parts.push(`.${cls}`);
      }
    } else if (value === true) {
      parts.push(key);
    } else {
      parts.push(`${key}=${serializeValue(value, options)}`);
    }
  }

  return parts.length > 0 ? `{${parts.join(" ")}}` : "";
}

/**
 * Print binding component: {{ value }} or {{ value || 'default' }}
 */
function printBinding(node: TextComponentNode, options: Options): Doc {
  const value = node.attributes?.value ?? "";
  const defaultValue = node.attributes?.defaultValue;

  if (defaultValue !== undefined && defaultValue !== "undefined") {
    return [`{{ ${value} || ${quoteString(String(defaultValue), options)} }}`];
  }

  return [`{{ ${value} }}`];
}

/**
 * Check if span component uses shorthand form [content] vs explicit
 * :span[content]
 */
function isShorthandSpan(node: TextComponentNode): boolean {
  if (node.name !== "span") {
    return false;
  }

  const pos = node.position;
  if (!pos) {
    return false;
  }

  const nodeLength = pos.end.offset! - pos.start.offset!;

  if (node.children && node.children.length > 0) {
    const firstChild = node.children[0];
    if (firstChild.position) {
      // Shorthand: [content] - first child starts at offset + 1
      // Explicit: :span[content] - first child starts at offset + 6
      return firstChild.position.start.offset === pos.start.offset! + 1;
    }
  }

  // No children: :span has length 5, [] has length 2, [ ] has length 3
  return nodeLength <= 3;
}

const EMPTY_PROPS_RE = /\{\s*\}\s*$/;

/**
 * Print inline text component: :name[content]{attrs} Special cases:
 *
 * - Binding: {{ value }}
 * - Span shorthand without attrs: [content]
 */
export function printTextComponent(
  path: AstPath<TextComponentNode>,
  print: PrintFn,
  options: ParserOptions,
): Doc {
  const { node } = path;

  if (node.name === "binding") {
    return printBinding(node, options);
  }

  const attrStr = printAttributes(node, options);

  function printChildrenWithEscapedBrackets(): Doc[] {
    const childParts: Doc[] = [];
    for (let i = 0; i < node.children!.length; i++) {
      const child = node.children![i];
      if (
        child.type === "text" ||
        // @ts-expect-error prettier internal type
        child.type === "sentence" ||
        // @ts-expect-error prettier internal type
        child.type === "whitespace"
      ) {
        childParts.push(escapeTextBrackets(child));
      } else {
        childParts.push(path.call(print as any, "children", i));
      }
    }

    return childParts;
  }

  // Span shorthand: [content] or [content]{attrs}
  if (isShorthandSpan(node)) {
    if (node.children && node.children.length > 0) {
      return ["[", ...printChildrenWithEscapedBrackets(), "]", attrStr];
    }

    return ["[]", attrStr];
  }

  const parts: Doc[] = [`:${node.name}`];

  // Print children inside brackets if any
  if (node.children && node.children.length > 0) {
    parts.push("[", ...printChildrenWithEscapedBrackets(), "]");
  }

  if (attrStr) {
    parts.push(attrStr);
  } else if (node.position) {
    const text = options.originalText.slice(
      node.position.start.offset,
      node.position.end.offset,
    );

    if (EMPTY_PROPS_RE.test(text)) {
      parts.push("{}");
    }
  }

  return parts;
}

/**
 * Calculate the nesting depth of a container component
 */
function getContainerDepth(path: AstPath): number {
  let depth = 0;
  // Use path.stack to traverse ancestors
  // path.stack is [root, 'children', index, node, 'children', index, node, ...]
  for (const item of path.stack) {
    if (
      typeof item === "object" &&
      item !== null &&
      "type" in item &&
      item.type === "containerComponent"
    ) {
      depth++;
    }
  }

  // Subtract 1 because the current node is also counted
  return Math.max(0, depth - 1);
}

export function printContainerComponentWithYamlDoc(
  path: AstPath<ContainerComponentNode>,
  print: PrintFn,
  options: Options,
  yamlDoc: Doc[],
): Doc {
  const { node } = path;
  const depth = getContainerDepth(path);
  const colons = ":".repeat(depth + 2);
  const parts: Doc[] = [colons, node.name];

  // Opening tag: ::name{attrs}

  const attrStr = printAttributes(node, options);
  if (attrStr) {
    parts.push(attrStr);
  }

  parts.push(hardline);

  // Add YAML doc if present
  if (yamlDoc.length > 0) {
    parts.push(...yamlDoc);
  }

  if (node.children && node.children.length > 0) {
    // Check if there's a blank line between rawData and first child in original input
    if (yamlDoc.length > 0 && node.rawData) {
      const componentStartLine = node.position?.start.line ?? 0;
      // rawData format: "\n<content>\n---"
      // Count newlines in rawData to determine where it ends
      const rawDataNewlines = (node.rawData.match(/\n/g) ?? []).length;
      // rawData block: starts at line after component opening, includes opening --- and closing ---
      // Opening --- is on componentStartLine + 1
      // rawData ends at componentStartLine + 1 + rawDataNewlines
      const rawDataEndLine = componentStartLine + 1 + rawDataNewlines;

      const firstChild = node.children[0] as {
        position?: { start: { line: number } };
      };
      const firstChildLine = firstChild.position?.start.line ?? 0;

      // If first child starts more than 1 line after rawData ends, there's a blank line
      if (firstChildLine > rawDataEndLine + 1) {
        parts.push(hardline);
      }
    }
    const childDocs = mapChildren(path, print);
    parts.push(join(hardline, childDocs));
    parts.push(hardline);
  }

  // Closing tag
  parts.push(colons);

  return parts;
}

/**
 * Print component container section (slot): #name\ncontent
 */
export function printComponentContainerSection(
  path: AstPath<ComponentContainerSectionNode>,
  print: PrintFn,
): Doc {
  const { node } = path;
  const parts: Doc[] = [];

  if (node.name && node.name !== "default") {
    parts.push(`#${node.name}`, hardline);
  }

  if (node.children && node.children.length > 0) {
    const childDocs = mapChildren(path, print);
    parts.push(join(hardline, childDocs));
  }

  return parts;
}

/**
 * Recursively escape brackets in text content
 */
function escapeTextBrackets(node: any): string {
  if (node.type === "text" || node.type === "word") {
    return node.value.replace(/\[/g, "\\[").replace(/\]/g, "\\]");
  }
  if (node.type === "whitespace") {
    return node.value;
  }
  if ("children" in node && Array.isArray(node.children)) {
    return node.children.map(escapeTextBrackets).join("");
  }

  return "";
}

/**
 * Print link with MDC children: [content](url) This is needed because
 * prettier's markdown printer adds breaks between children
 */
export function printLink(
  path: AstPath<LinkNode>,
  print: PrintFn,
  options: Options,
): Doc {
  const { node } = path;

  // Print children, escaping brackets in text nodes
  const childParts: Doc[] = [];
  for (let i = 0; i < node.children.length; i++) {
    const child = node.children[i];
    if (
      child.type === "text" ||
      child.type === "sentence" ||
      child.type === "whitespace"
    ) {
      // Escape brackets in text content inside links
      childParts.push(escapeTextBrackets(child));
    } else {
      childParts.push(path.call(print as any, "children", i));
    }
  }

  const parts: Doc[] = ["[", ...childParts, "]"];

  parts.push("(", node.url);
  if (node.title) {
    const quote = options.singleQuote ? "'" : '"';
    parts.push(" ", quote, node.title, quote);
  }
  parts.push(")");

  const attrStr = printAttributes(node, options);
  if (attrStr) {
    parts.push(attrStr);
  }

  return parts;
}
