import type { Parent } from "mdast";
import type {
  AstPath as PrettierAstPath,
  ParserOptions as PrettierParserOptions,
  Printer,
} from "prettier";
import type { Node } from "unist";

export type PrintFn<T = Parent> = Parameters<Printer<T>["print"]>[2];
export type AstPath<T = Parent> = PrettierAstPath<T>;
export type ParserOptions = PrettierParserOptions<Node>;

export type Attributes = Record<string, any>;

export type NodeWithAttributes = Node & {
  attributes?: Attributes;
};

export type YamlNode = Node & {
  type: "yaml";
  value: string;
};

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

export type LinkNode = Node & {
  type: "link";
  url: string;
  title?: string | null;
  children: Node[];
};

export type WordOrTextNode = Node & {
  type: "word" | "text";
  value: string;
};
