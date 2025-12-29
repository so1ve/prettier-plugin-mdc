import remarkGfm from "remark-gfm";
import remarkMdc from "remark-mdc";
import remarkParse from "remark-parse";
import { unified } from "unified";

const processor = unified()
  .use(remarkParse, { commonmark: true })
  .use(remarkGfm)
  .use(remarkMdc);

const input = ":test[scape \\\\[ character] text";
const ast = await processor.run(processor.parse(input));
console.log("INPUT:", input);
console.log("AST:", JSON.stringify(ast.children[0], null, 2));
