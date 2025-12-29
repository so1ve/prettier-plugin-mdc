import type { Printer } from "prettier";
import * as markdown from "prettier/plugins/markdown";
import type { Node } from "unist";

import { AST_FORMAT } from "./constants";
import {
  isComponentContainerSectionNode,
  isContainerComponentNode,
  isLinkNode,
  isTextComponentNode,
  linkNeedsCustomPrinting,
} from "./is";
import {
  printAttributes,
  printComponentContainerSection,
  printContainerComponent,
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
import { hasInlineAttribute } from "./utils";
import type { MDCNodeTypes } from "./visitor-keys";
import { mdcNodeTypes, visitorKeys } from "./visitor-keys";

// @ts-expect-error -- does not provide public exports
const mdastPrinter: Printer = markdown.printers.mdast;

export const printers: Record<typeof AST_FORMAT, Printer<Node>> = {
  [AST_FORMAT]: {
    ...mdastPrinter,
    getVisitorKeys(node, nonTraversableKeys) {
      if (mdcNodeTypes.includes(node.type)) {
        return visitorKeys[node.type as MDCNodeTypes];
      }

      return mdastPrinter.getVisitorKeys!(node, nonTraversableKeys);
    },
    print(path, options, print, args) {
      const { node } = path;

      if (hasInlineAttribute(node)) {
        // Let the markdown printer handle the node first, then add attributes
        const printed = mdastPrinter.print(path, options, print, args);

        return [printed, printAttributes(node, options)];
      }

      if (isLinkNode(node) && linkNeedsCustomPrinting(node)) {
        return printLink(path as AstPath<LinkNode>, print, options);
      }

      if (isTextComponentNode(node)) {
        return printTextComponent(
          path as AstPath<TextComponentNode>,
          print,
          options,
        );
      } else if (isContainerComponentNode(node)) {
        return printContainerComponent(
          path as AstPath<ContainerComponentNode>,
          print,
          options,
        );
      } else if (isComponentContainerSectionNode(node)) {
        return printComponentContainerSection(
          path as AstPath<ComponentContainerSectionNode>,
          print,
        );
      }

      return mdastPrinter.print(path, options, print, args);
    },
  } as Printer<Node>,
};
