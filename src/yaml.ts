import { createRequire } from "node:module";

import type { Options } from "prettier";
import { createSyncFn } from "synckit";

const require = createRequire(import.meta.url);

export const formatYaml: (text: string, options: Options) => string = (
  text,
  options,
) => {
  const fn = createSyncFn(require.resolve("./yaml-worker.mjs"));

  return fn(text, {
    tabWidth: options.tabWidth,
    useTabs: options.useTabs,
    singleQuote: options.singleQuote,
    printWidth: options.printWidth,
    proseWrap: options.proseWrap,
  });
};
