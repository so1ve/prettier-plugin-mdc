import type { Node } from "unist";

import { isContainerComponentNode } from "./is";

export function validateYamlBlocks(ast: Node, text: string): void {
  function visit(node: Node): void {
    if (isContainerComponentNode(node)) {
      const pos = node.position;

      if (pos) {
        const startLine = pos.start.line;
        const lines = text.split("\n");

        if (startLine < lines.length) {
          const nextLine = lines[startLine];
          if (nextLine?.trim() === "---" && !node.rawData) {
            throw new Error(
              `Invalid YAML block in component "${node.name}" at line ${startLine + 1}: YAML block is
    not properly closed`,
            );
          }
        }
      }

      if (node.children) {
        for (const child of node.children) {
          visit(child);
        }
      }
    } else if ("children" in node && Array.isArray(node.children)) {
      for (const child of node.children) {
        visit(child);
      }
    }
  }

  visit(ast);
}
