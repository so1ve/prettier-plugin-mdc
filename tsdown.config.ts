import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["./src/index.ts", "./src/yaml-worker.ts"],
	clean: true,
	dts: { oxc: true },
	exports: true,
});
