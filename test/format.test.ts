import { runTests } from "./utils";

runTests({
	nested1: [
		"::container",
		"---",
		'background-color: "#eee"',
		"padding: 20px",
		"---",
		"# This is a header",
		"",
		':icon{color="#000" name="mdi:github" size="36px"}',
		"",
		"  :::content2",
		"  Well",
		"  :::",
		"::",
	].join("\n"),

	nested2: [
		"::container",
		"---",
		"bi:",
		"  url: https://example.com",
		"  bg: contain",
		"styles: |",
		"  p {",
		"    color: red;",
		"  }",
		"---",
		"::",
	].join("\n"),

	list1: [
		"- This is a list item.",
		"",
		"::container",
		"- This is a list item.",
		"::",
	].join("\n"),

	list2: [
		"- This is a list item.",
		"  ::container",
		"  - This is a list item.",
		"  ::",
	].join("\n"),

	list4: [
		"::parent",
		"- This is a list item.",
		"",
		"  :::container",
		"  - This is a list item.",
		"  :::",
		"::",
	].join("\n"),

	list5: [
		"- This is a list item.",
		"  ::container",
		"  - This is a list item.",
		"  ::",
	].join("\n"),

	list6: [
		"::parent",
		"- This is a list item.",
		"    :::container",
		"    - This is a list item.",
		"    :::",
		"::",
	].join("\n"),

	list7: [
		"- This is a list item.",
		"    :::container",
		"    - This is a list item.",
		"    :::",
	].join("\n"),

	list8: [
		"::page-section",
		"---",
		"background-image:",
		"  url:   https://images.example.com/dog.png",
		"color: red",
		"---",
		"- This is a list item.2",
		"",
		"  :::container",
		"  :::",
		"::",
	].join("\n"),

	list10: `---
title: ""
description: ""
---

## This section contains a bunch of lists

- This is a list item.
- This is a list item.
  - This is a CHILD list item.
    - This is a GRANDCHILD list item.
- This is a list item.

::page-section
---
background-image:
  url: https://images.example.com/dog.png
color: red
---
- This is a list item.
- This is a list item.
  - This is a CHILD list item.
    - This is a GRANDCHILD list item.
- This is a list item.

  :::container
  - This is a list item.
  - This is a list item.
  - This is a CHILD list item.
    - This is a GRANDCHILD list item.
  - This is a list item.
  :::

  :::container
  - This is a list item.
  - This is a list item.
    - This is a CHILD list item.
      - This is a GRANDCHILD list item.
  - This is a list item.

  :button[This is nested another level]

    ::::container
    ---
    background-image:
      url: https://images.example.com/dog.png
    color: red
    ---
    - This is a list item.
    - This is a list item.
      - This is a CHILD list item.
        - This is a GRANDCHILD list item.
    - This is a list item.

    This content is below the list.
    ::::

  :icon{name="mdi:github"}

  More outer content.
  :::
::`,

	list11: `::page-container
---
simple-array:
  - item1
  - item2
  - item3
---
::

::page-container
---
items:
  - name: Item 1
    description: First item
  - name: Item 2
    description: Second item
---
::

::page-container
---
attributes:
  - domains:
      - internal
  - env:
      - dev
      - staging
      - prod
  - dogs:
      - husky
      - beagle
---
::`,

	list12: `::page-section
- This is a list item.

  :::container
  - This is a list item.
  :::
::`,
});
