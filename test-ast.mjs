import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import remarkMdc from "remark-mdc";
import remarkParse from "remark-parse";
import { unified } from "unified";

const testCases = ["[[span]](#href)"];

async function parseAndPrint(markdown) {
  const processor = unified()
    .use(remarkParse, { commonmark: true })
    .use(remarkMath)
    .use(remarkGfm)
    .use(remarkMdc);

  const ast = await processor.run(processor.parse(markdown));

  console.log("=".repeat(60));
  console.log("INPUT:");
  console.log(markdown);
  console.log("-".repeat(60));
  console.log("AST:");
  console.log(JSON.stringify(ast, null, 2));
  console.log("\n");
}

for (const testCase of testCases) {
  await parseAndPrint(testCase);
}
