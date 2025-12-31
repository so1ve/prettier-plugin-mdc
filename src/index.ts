import type { SupportLanguage } from "prettier";

import { AST_FORMAT } from "./constants";

export { parsers } from "./parsers";
export { printers } from "./printers";

export const languages: SupportLanguage[] = [
  {
    name: "mdc",
    parsers: [AST_FORMAT],
    extensions: [".mdc"],
    vscodeLanguageIds: ["mdc"],
  },
];
