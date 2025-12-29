export type MDCNodeTypes = keyof typeof visitorKeys;

// put it here because @keep-sorted not working on first line... idk why
// @keep-sorted
export const visitorKeys = {
	componentContainerSection: ["children"],
	containerComponent: ["children"],
	textComponent: ["children"],
};

export const mdcNodeTypes = Object.keys(visitorKeys);
