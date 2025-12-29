import { describe } from "vitest";

import { runTests } from "../utils";

describe("auto-unwrap", () => {
  runTests({
    simple: "::test\nHello World\n::",
    slot: "::test\n#title\nHello World\n::",
    twoSlots: "::test\nFoo bar\n\n#title\nHello World\n::",
    twoChildren: "::test\nFoo bar\n\nHello World\n::",
    componentChildren: "::test\n  :::another-component\n  :::\n::",
  });
});
