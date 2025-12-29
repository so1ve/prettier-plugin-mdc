export type MDCNodeTypes = keyof typeof visitorKeys;

// put it here because @keep-sorted not working on first line... idk why
// @keep-sorted
export const visitorKeys = {
	componentContainerSection: ["children"] as const,
	containerComponent: ["children"] as const,
	textComponent: ["children"] as const,
};

export const mdcNodeTypes: string[] = Object.keys(visitorKeys);
