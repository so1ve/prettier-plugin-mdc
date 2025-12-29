import { describe } from "vitest";

import { runTests } from "./utils";

describe("ul", () => {
  runTests({
    simple: "- item 1\n- item 2\n- item 3",
    nested: "- item 1\n  - item 2\n  - item 3",
    mixed: "- item 1\n- item 2\n  - item 3\n- item 4",
    mixed2: "- item 1\n- item 2\n  - item 3\n- item 4",
    mixed3: "- item 1\n- item 2\n  - item 3\n- item 4",
    mixed4: "- item 1\n- item 2\n  - item 3\n- item 4",
    mixed5: [
      "- This is a list item.",
      "  - This is a CHILD list item.",
      "    - This is a GRANDCHILD list item.",
    ].join("\n"),
  });
});
