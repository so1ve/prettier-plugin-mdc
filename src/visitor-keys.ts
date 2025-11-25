export const visitorKeys = {
	containerComponent: [],
	textComponent: [],
	componentContainerSection: [],
};

export type MDCNodeTypes = keyof typeof visitorKeys;

export const mdcNodeTypes = Object.keys(visitorKeys);
