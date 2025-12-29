import { describe } from "vitest";

import { runTests } from "./utils";

describe("span", () => {
  runTests({
    "simple": "[span]",
    "complex _": "[span _span_ **span** `span`]",
    "complex": '[span _span_ **span** `span`]{a="a" b="b"}',
    "inside-link-valid": "[ [span]](#href)",
    "inside-link-invalid": "[[span]](#href)",
    "with-attributes":
      '[span]{#theid.aclass foo="bar" class="anotherclass" class="andother"}',
    "[x]": "[x]",
    "[ ]": "[ ]",
    "respect-gfm-check-list": "- [ ] task 1\n- [X] task 2",
    "respect-reference-style-link": "[link][ref]\n\n[ref]: http://example.com",
    "ignore-double-bracket": "[[wikilink]]",
    "ignored-bracket": "\\[label]",
  });
});
