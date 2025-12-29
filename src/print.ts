import type { Doc, Options } from "prettier";
import { doc } from "prettier";

import type {
  AstPath,
  ComponentContainerSectionNode,
  ContainerComponentNode,
  LinkNode,
  NodeWithAttributes,
  PrintFn,
  TextComponentNode,
} from "./types";
import { escapeQuotes } from "./utils";
import { formatYaml } from "./yaml";

const { hardline, join } = doc.builders;

const mapChildren = (path: AstPath<any>, print: PrintFn): Doc[] =>
  path.map(print as any, "children");

function serializeValue(value: unknown, options: Options): string {
  const quote = options.singleQuote ? "'" : '"';

  if (typeof value === "string") {
    const escaped = escapeQuotes(value.replace(/\\/g, "\\\\"), quote);

    return `${quote}${escaped}${quote}`;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }

  // For objects/arrays, use JSON
  const escaped = escapeQuotes(JSON.stringify(value), quote);

  return `${quote}${escaped}${quote}`;
}

export function printAttributes(
  node: NodeWithAttributes,
  options: Options,
): string {
  const attrs = node.attributes;
  if (!attrs || Object.keys(attrs).length === 0) {
    return "";
  }

  const parts: string[] = [];

  for (const [key, value] of Object.entries(attrs)) {
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
  const quote = options.singleQuote ? "'" : '"';

  if (defaultValue !== undefined && defaultValue !== "undefined") {
    const escaped = escapeQuotes(String(defaultValue), quote);

    return [`{{ ${value} || ${quote}${escaped}${quote} }}`];
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

/**
 * Print inline text component: :name[content]{attrs} Special cases:
 *
 * - Binding: {{ value }}
 * - Span shorthand without attrs: [content]
 */
export function printTextComponent(
  path: AstPath<TextComponentNode>,
  print: PrintFn,
  options: Options,
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

/**
 * Print YAML front matter from rawData rawData format: "\nkey: value\n---"
 */
function printRawData(rawData: string | undefined, options: Options): Doc[] {
  if (!rawData) {
    return [];
  }

  // rawData starts with \n and ends with ---
  // We need to output: ---\n<content>\n---\n
  let content = rawData.slice(1, -3).trimEnd();
  if (!content) {
    return [];
  }

  content = formatYaml(content, options);

  // Split into lines and join with hardline so prettier can handle indentation
  const lines = content.split("\n");

  return ["---", hardline, join(hardline, lines), hardline, "---", hardline];
}

/**
 * Print container component: ::name{attrs}\n---\nfmAttrs\n---\nchildren\n::
 */
export function printContainerComponent(
  path: AstPath<ContainerComponentNode>,
  print: PrintFn,
  options: Options,
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

  parts.push(...printRawData(node.rawData, options));

  if (node.children && node.children.length > 0) {
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

  return parts;
}
