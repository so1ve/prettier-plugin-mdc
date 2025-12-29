import { describe } from "vitest";

import { runTests } from "./utils";

describe("Attributes", () => {
	runTests({
		"id-suger": ":test{#id} text",
		"class-suger": ':test{.class .another-class key="value"} text',
		"boolean": ":test{prop} text",
		"html-characters": ':test{icon="&copy;"} text',
		"html-characters-unquoted": ":test{icon=&copy;} text",
		"value-with-space": ":test{attr= value} text",
		"invalid-binding": ":test{:} text",
		"fragment-attribute":
			"[![Nuxt](https://nuxtjs.org/design-kit/colored-logo.svg){.nest}](https:test){.cls}",
		"image":
			"![Nuxt](https://nuxtjs.org/design-kit/colored-logo.svg){#id .class}",
		"nested": '[Hello [World]{.x}](/world){style="color: green"}',
		"nested2": '[Hello [World](/world){.x}]{style="color: green"}',
		"nested3":
			"_**[Nuxt](https://nuxtjs.org){#id .class} strong**{#id2 .class2} emphasis_{#id3 .class3}",
		"code": "`code`{#id .class}",
		"# in class": "`code`{#id .bg-[#E74249]}",
		"strong": "**strong**{#id .class}",
		"link": "[Nuxt](https://nuxtjs.org){#id .class}",
		"linkReference": "[Nuxt][nuxt]{#id .class}\n\n[nuxt]: https://nuxt.com",
		"emphasis": "_emphasis_{#id .class}",
		"nested-in-table": [
			"| Col1 |      Col2      |",
			"|  --  |      -----     |",
			'|  aa  | [a](/a){a="a"} |',
		].join("\n"),
		"ignoreEscapeCharacterInNormalAttribute": ':copy{code="D:\\Software\\"}',
		"ignoreEscapeCharacterInNormalAttributeYaml":
			"::copy\n---\ncode: D:\\Software\\\n---\n::",
		"sort-attributes": ':test{a="a" c="c" b="b"} text',
	});
});
