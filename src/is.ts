import type { Node } from "unist";

import type {
  ComponentContainerSectionNode,
  ContainerComponentNode,
  LinkNode,
  TextComponentNode,
  WordOrTextNode,
} from "./types";

export const isTextComponentNode = (node: Node): node is TextComponentNode =>
  node.type === "textComponent";

export const isContainerComponentNode = (
  node: Node,
): node is ContainerComponentNode => node.type === "containerComponent";

export const isComponentContainerSectionNode = (
  node: Node,
): node is ComponentContainerSectionNode =>
  node.type === "componentContainerSection";

export const isLinkNode = (node: Node): node is LinkNode =>
  node.type === "link";

export const isWordOrTextNode = (node: Node): node is WordOrTextNode =>
  node.type === "word" || node.type === "text";

/**
 * Check if a node has any textComponent descendants
 */
function hasTextComponentDescendant(node: Node): boolean {
  if (isTextComponentNode(node)) {
    return true;
  }
  if ("children" in node && Array.isArray(node.children)) {
    return node.children.some(hasTextComponentDescendant);
  }

  return false;
}

function hasTextWithBrackets(node: Node): boolean {
  if (isWordOrTextNode(node) && /[[\]]/.test(node.value)) {
    return true;
  }
  if ("children" in node && Array.isArray(node.children)) {
    return node.children.some(hasTextWithBrackets);
  }

  return false;
}

/**
 * Check if a link needs custom printing (has textComponent or brackets in text)
 */
export function linkNeedsCustomPrinting(node: LinkNode): boolean {
  if (!node.children) {
    return false;
  }

  for (const child of node.children) {
    if (
      isTextComponentNode(child) ||
      hasTextWithBrackets(child) ||
      ("children" in child && hasTextComponentDescendant(child))
    ) {
      return true;
    }
  }

  return false;
}
