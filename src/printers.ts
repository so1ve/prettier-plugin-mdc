import type { Doc, Printer } from "prettier";
import { doc } from "prettier";
import * as markdown from "prettier/plugins/markdown";
import type { Node } from "unist";

import { AST_FORMAT } from "./constants";
import {
  isComponentContainerSectionNode,
  isContainerComponentNode,
  isLinkNode,
  isTextComponentNode,
  isYamlNode,
  linkNeedsCustomPrinting,
} from "./is";
import {
  printAttributes,
  printComponentContainerSection,
  printContainerComponentWithYamlDoc,
  printLink,
  printTextComponent,
} from "./print";
import type {
  AstPath,
  ComponentContainerSectionNode,
  ContainerComponentNode,
  LinkNode,
  TextComponentNode,
} from "./types";
import { extendedInlineNodesHaveAttributes } from "./utils";
import type { MDCNodeTypes } from "./visitor-keys";
import { mdcNodeTypes, visitorKeys } from "./visitor-keys";

const { hardline } = doc.builders;

// @ts-expect-error -- does not provide public exports
const mdastPrinter: Printer = markdown.printers.mdast;

function extractYamlContent(rawData: string | undefined): string | undefined {
  if (!rawData) {
    return undefined;
  }

  // rawData starts with \n and ends with ---
  const content = rawData.trimEnd().slice(1, -3).trimEnd();

  return content || undefined;
}

export const printers: Record<typeof AST_FORMAT, Printer<Node>> = {
  [AST_FORMAT]: {
    ...mdastPrinter,
    getVisitorKeys(node, nonTraversableKeys) {
      if (mdcNodeTypes.includes(node.type)) {
        return visitorKeys[node.type as MDCNodeTypes];
      }

      return mdastPrinter.getVisitorKeys!(node, nonTraversableKeys);
    },
    embed(path) {
      const { node } = path;

      // frontmatter
      if (isYamlNode(node)) {
        return async (textToDoc): Promise<Doc> => {
          let yamlDoc: Doc;
          try {
            yamlDoc = await textToDoc(node.value, { parser: "yaml" });
          } catch {
            yamlDoc = node.value;
          }

          return ["---", hardline, yamlDoc, hardline, "---", hardline];
        };
      }

      if (isContainerComponentNode(node) && node.rawData) {
        const yamlContent = extractYamlContent(node.rawData);
        if (yamlContent) {
          return async (textToDoc, print, _path, options): Promise<Doc> => {
            let yamlDoc: Doc;
            try {
              yamlDoc = await textToDoc(yamlContent, { parser: "yaml" });
            } catch {
              yamlDoc = yamlContent;
            }

            return printContainerComponentWithYamlDoc(
              path as AstPath<ContainerComponentNode>,
              print,
              options,
              ["---", hardline, yamlDoc, hardline, "---", hardline],
            );
          };
        }
      }

      return null;
    },
    print(path, options, print) {
      const { node } = path;

      // Link with textComponent children needs custom printing
      // Check this before hasInlineAttribute since printLink handles attributes too
      if (isLinkNode(node) && linkNeedsCustomPrinting(node)) {
        return printLink(path as AstPath<LinkNode>, print, options);
      }

      if (extendedInlineNodesHaveAttributes(node)) {
        // Let the markdown printer handle the node first, then add attributes
        const printed = mdastPrinter.print(path, options, print);

        return [printed, printAttributes(node, options)];
      }

      if (isTextComponentNode(node)) {
        return printTextComponent(
          path as AstPath<TextComponentNode>,
          print,
          options,
        );
      } else if (isContainerComponentNode(node)) {
        // If node has rawData with YAML, it's handled by embed
        // This branch handles containerComponents without rawData
        return printContainerComponentWithYamlDoc(
          path as AstPath<ContainerComponentNode>,
          print,
          options,
          [],
        );
      } else if (isComponentContainerSectionNode(node)) {
        return printComponentContainerSection(
          path as AstPath<ComponentContainerSectionNode>,
          print,
        );
      }

      return mdastPrinter.print(path, options, print);
    },
  } as Printer<Node>,
};
