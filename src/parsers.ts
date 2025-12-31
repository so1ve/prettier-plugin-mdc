import { fromMarkdown } from "mdast-util-from-markdown";
import { frontmatterFromMarkdown } from "mdast-util-frontmatter";
import { gfmFromMarkdown } from "mdast-util-gfm";
import { mathFromMarkdown } from "mdast-util-math";
import { frontmatter } from "micromark-extension-frontmatter";
import { gfm } from "micromark-extension-gfm";
import { math } from "micromark-extension-math";
import type { Parser } from "prettier";
import markdown from "prettier/parser-markdown";
import remarkMdc, { micromarkExtension } from "remark-mdc";
import type { Node } from "unist";

import { AST_FORMAT } from "./constants";
import { validateYamlBlocks } from "./validate";

function getMdcFromMarkdownExtensions(): any[] {
  const data: Record<string, unknown[]> = {};
  const fakeContext = {
    data: () => data,
  };
  remarkMdc.call(fakeContext as any, {});

  return data.fromMarkdownExtensions ?? [];
}

const mdcFromMarkdownExtensions = getMdcFromMarkdownExtensions();

export const parsers: Record<typeof AST_FORMAT, Parser<Node>> = {
  [AST_FORMAT]: {
    ...markdown.parsers.markdown,
    astFormat: AST_FORMAT,
    parse(text) {
      const ast = fromMarkdown(text, {
        extensions: [
          frontmatter(["yaml"]),
          gfm(),
          math(),
          micromarkExtension(),
        ],
        mdastExtensions: [
          frontmatterFromMarkdown(["yaml"]),
          gfmFromMarkdown(),
          mathFromMarkdown(),
          ...mdcFromMarkdownExtensions,
        ],
      });

      validateYamlBlocks(ast, text);

      return ast;
    },
  } as Parser<Node>,
};
