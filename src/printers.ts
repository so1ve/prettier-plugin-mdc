import type { Printer } from "prettier";
import * as markdown from "prettier/plugins/markdown";

// @ts-expect-error -- estree does not provide public exports
const mdastPrinter: Printer = markdown.printers.mdast;

export const printers = {
	mdast: {
		...mdastPrinter,
		print(path, options, print, args) {
			return mdastPrinter.print(path, options, print, args);
		},
	},
} satisfies Record<string, Printer>;
