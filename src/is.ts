import type { Node } from "unist";

import type {
	ComponentContainerSectionNode,
	ContainerComponentNode,
	TextComponentNode,
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
