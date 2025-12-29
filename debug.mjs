import * as prettier from "prettier";

const testCases = ["[ [span]](#href)", "[[span]](#href)", "[test](#href)"];

for (const testCase of testCases) {
  console.log("=".repeat(60));
  console.log("INPUT:", JSON.stringify(testCase));
  const result = await prettier.format(testCase, {
    plugins: ["./dist/index.mjs"],
    filepath: "test.md",
    parser: "mdc",
  });
  console.log("OUTPUT:", JSON.stringify(result));
  console.log("");
}
