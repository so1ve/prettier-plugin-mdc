import { describe } from "vitest";

import { runTests } from "../utils";

describe("basic", () => {
  runTests({
    simple: ["paragraph 1", "", "---", "", "paragraph 2"].join("\n"),
    link: '[link](https://nuxtjs.org){target="_blank"}',
    linkWithAmpersand:
      '[link](https://nuxtjs.org/?utm_source=benevolt&utm_campaign=mailingassos){target="_blank"}',
    li: ["- inline :component", "- inline :component[text]"].join("\n"),
  });
});
