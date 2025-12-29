import { describe } from "vitest";

import { runTests } from "./utils";

describe("inline-component", () => {
	runTests({
		"empty": ":component text",
		"text": ":component[text] text",
		"with-attribute": ":component[text]{.class} text",
		"strong": "**:component[text]{.class}**",
		"underlined": "**:component[text]{.class}**",
		"parentheses": "(:component[text]{.class})",
		"binding": "{{ $doc.variable }}",
		"bindingWithDefault": "{{ $doc.variable || 'mdc' }}",
		"kbd":
			'::tip\nYou can also use the shortcut :kbd{value="meta"} + :kbd{value="."} to redirect to the Studio route.\n::',
	});
});
