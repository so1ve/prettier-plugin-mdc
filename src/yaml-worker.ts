import type { Options } from "prettier";
import * as prettier from "prettier";
import { runAsWorker } from "synckit";

runAsWorker(async (text: string, options: Options): Promise<string> => {
  const formatted = await prettier.format(text, {
    ...options,
    parser: "yaml",
  });

  return formatted.trimEnd();
});
