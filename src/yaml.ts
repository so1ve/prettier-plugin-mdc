import { createRequire } from "node:module";

import type { Options } from "prettier";
import { createSyncFn } from "synckit";

const require = createRequire(import.meta.url);

export const formatYaml: (text: string, options: Options) => string =
	createSyncFn(require.resolve("./yaml-worker.mjs"));
