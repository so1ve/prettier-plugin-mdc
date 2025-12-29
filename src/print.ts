import type { ContainerComponentNode, TextComponentNode } from "./types";

const CONTAINER_NODE_TYPES = new Set([
	"componentContainerSection",
	"containerComponent",
	"leafComponent",
]);

const NON_UNWRAPPABLE_TYPES = new Set([
	"code",
	"componentContainerDataSection",
	"componentContainerSection",
	"containerComponent",
	"heading",
	"leafComponent",
	"pre",
	"table",
	"textComponent",
]);

export function printContainerComponent(node: ContainerComponentNode) {}

export function printTextComponent(node: TextComponentNode) {}
