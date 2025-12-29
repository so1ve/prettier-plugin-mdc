import { describe } from "vitest";

import { runTests } from "./utils";

describe("label", () => {
  runTests({
    "simple": ":test[label] text",
    "empty": ":test[] text",
    "scaped-characters": ":test[scape \\[ character] text",
    "invalid-label-eol": ":test[\n",
    "invalid-label-eof": ":test[ text",
  });
});
