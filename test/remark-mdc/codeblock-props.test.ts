import { describe } from "vitest";

import { runTests } from "../utils";

describe("codeblock-props", () => {
  runTests({
    "YamlProps":
      "::with-frontmatter-yaml\n```yaml [props]\narray:\n  - item\n  - itemKey: value\nkey: value\n```\n::",
    "notYamlProps":
      "::with-frontmatter-yaml\n```yaml\nkey: value\narray:\n  - item\n  - itemKey: value\n```\n::",
    "notYamlProps2":
      "::with-frontmatter-yaml\n```yaml[props]\nkey: value\narray:\n  - item\n  - itemKey: value\n```\n::",
    "notYamlProps3":
      "::with-frontmatter-yaml\n```yaml [yaml]\nkey: value\narray:\n  - item\n  - itemKey: value\n```\n::",
    "shouldConvertYamlProps":
      "::with-frontmatter-yaml\n---\narray:\n  - item\n  - itemKey: value\nkey: value\n---\n::",
    "yamlProps1": [
      "::with-frontmatter-yaml1",
      "```yaml [props]",
      "key: value",
      "key2:",
      "  subkey: value",
      "  subkey2: value",
      "array:",
      "  - item",
      "  - itemKey: value",
      "```",
      "::",
    ].join("\n"),
    "nested-component-yamlProps": [
      "::with-frontmatter-and-nested-component-yaml",
      "```yaml [props]",
      "array:",
      "  - item",
      "  - itemKey: value",
      "key: value",
      "```",
      "Default slot",
      "",
      "#secondary-slot",
      "Secondary slot value",
      "",
      "  :::hello",
      "  ```yaml [props]",
      "  key: value",
      "  ```",
      "  :::",
      "::",
    ].join("\n"),
  });
});
