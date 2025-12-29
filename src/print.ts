import type { Doc } from "prettier";
import { doc } from "prettier";

import type {
	AstPath,
	ComponentContainerSectionNode,
	ContainerComponentNode,
	NodeWithAttributes,
	PrintFn,
	TextComponentNode,
} from "./types";
import { formatYaml } from "./yaml";

const { hardline, join } = doc.builders;

// Helper to map children - workaround for TypeScript limitations with path.map
const mapChildren = (path: AstPath<any>, print: PrintFn): Doc[] =>
	path.map(print as any, "children");

/**
 * Serialize attribute value
 */
function serializeValue(value: unknown): string {
	if (typeof value === "string") {
		// Escape double quotes and backslashes inside the string
		const escaped = value.replace(/\\/g, "\\\\").replace(/"/g, '\\"');

		return `"${escaped}"`;
	}
	if (typeof value === "number" || typeof value === "boolean") {
		return String(value);
	}

	// For objects/arrays, use JSON
	return `'${JSON.stringify(value)}'`;
}

// TODO: rewrite
export function printAttributes(node: NodeWithAttributes): string {
	const attrs = node.attributes;
	if (!attrs || Object.keys(attrs).length === 0) {
		return "";
	}

	const parts: string[] = [];

	// Process each attribute in order
	for (const [key, value] of Object.entries(attrs)) {
		if (key === "id") {
			parts.push(`#${value}`);
		} else if (key === "class") {
			const classes = String(value).split(/\s+/).filter(Boolean);
			for (const cls of classes) {
				parts.push(`.${cls}`);
			}
		} else {
			parts.push(`${key}=${serializeValue(value)}`);
		}
	}

	return parts.length > 0 ? `{${parts.join(" ")}}` : "";
}

/**
 * Print inline text component: :name[content]{attrs}
 */
export function printTextComponent(
	path: AstPath<TextComponentNode>,
	print: PrintFn,
): Doc[] {
	const { node } = path;
	const parts: Doc[] = [`:${node.name}`];

	// Print children inside brackets if any
	if (node.children && node.children.length > 0) {
		const childDocs = mapChildren(path, print);
		parts.push("[", ...childDocs, "]");
	}

	// Print attributes
	const attrStr = printAttributes(node);
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
 * Print YAML front matter from rawData
 * rawData format: "\nkey: value\n---"
 */
function printRawData(rawData: string | undefined): Doc[] {
	if (!rawData) {
		return [];
	}

	// rawData starts with \n and ends with ---
	// We need to output: ---\n<content>\n---\n
	let content = rawData.slice(1, -3).trimEnd(); // Remove leading \n and trailing ---
	if (!content) {
		return [];
	}

	content = formatYaml(content);

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
): Doc[] {
	const { node } = path;
	const depth = getContainerDepth(path);
	const colons = ":".repeat(depth + 2);
	const parts: Doc[] = [colons, node.name];

	// Opening tag: ::name{attrs}

	const attrStr = printAttributes(node);
	if (attrStr) {
		parts.push(attrStr);
	}

	parts.push(hardline);

	// Front matter attributes from rawData
	parts.push(...printRawData(node.rawData));

	// Print children
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

	// Slot name
	if (node.name && node.name !== "default") {
		parts.push(`#${node.name}`, hardline);
	}

	// Print children
	if (node.children && node.children.length > 0) {
		const childDocs = mapChildren(path, print);
		parts.push(join(hardline, childDocs));
	}

	return parts;
}
