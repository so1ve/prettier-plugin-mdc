import type { Parent, Parents } from "mdast";
import type { Node } from "unist";

declare module "unist" {
	interface Data {
		hName?: string;
		hProperties?: Record<string, any>;
	}
}

export interface ChildrenNode extends Node {
	value?: unknown;
	lang?: string;
	meta?: string;
}

export interface ComponentNode extends Node {
	name?: string;
	attributes?: Record<string, any>;
	fmAttributes?: Record<string, any>;
	rawData?: string;
	children?: ChildrenNode[];
}

export type Attributes = Record<string, any>;

export interface NodeWithAttributes extends Node {
	attributes?: Attributes;
}

export type TextComponentNode = Parents & {
	name: string;
	rawData: string;
	attributes: Record<string, any>;
};

export type ContainerComponentNode = Parents & {
	name: string;
	attributes?: Record<string, any>;
	fmAttributes?: Record<string, any>;
	rawData?: string;
};

export type ComponentContainerSectionNode = Parents & {
	name: string;
	attributes?: Record<string, any>;
};

export type Container = Parent & {
	type: "componentContainer";
	rawData?: string;
	mdc?: {
		unwrapped?: string;
		codeBlockProps?: boolean;
	};
};
