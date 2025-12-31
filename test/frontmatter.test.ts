import dedent from "dedent";
import { describe } from "vitest";

import { runTests } from "./utils";

describe("frontmatter", () => {
  runTests({
    basic: dedent`
    ---
    title:   ""
    date: ""
    ---
    `,
    content1: dedent`
    ---
    title: ""
    ---

    aa
    `,
    content2: dedent`
    ---
    title: ""
    ---
    aa
    `,
    content3: dedent`
    ---
    title: ""
    ---
    aa


    `,
    list: dedent`
    ---
    tags:
      - tag1
      - tag2
    ---
    `,
  });
});
