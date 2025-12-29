import type { Parent } from "mdast";
import type { AstPath as PrettierAstPath, Printer } from "prettier";
import type { Node } from "unist";

export type PrintFn<T = Parent> = Parameters<Printer<T>["print"]>[2];
export type AstPath<T = Parent> = PrettierAstPath<T>;

export type Attributes = Record<string, any>;

export interface NodeWithAttributes extends Node {
	attributes?: Attributes;
}

export type ContainerComponentNode = Parent & {
	type: "containerComponent";
	name: string;
	rawData?: string;
	mdc?: {
		unwrapped?: string;
		codeBlockProps?: boolean;
	};
};

export type ComponentContainerSectionNode = Parent & {
	type: "componentContainerSection";
	name: string;
	rawData?: string;
};

export type TextComponentNode = Partial<Parent> & {
	type: "textComponent";
	name: string;
	attributes: Record<string, any>;
};
