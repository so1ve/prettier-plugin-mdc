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
