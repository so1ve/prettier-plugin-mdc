export type MDCNodeTypes = keyof typeof visitorKeys;

// @keep-sorted
export const visitorKeys = {
  componentContainerSection: ["children"] as const,
  containerComponent: ["children"] as const,
  textComponent: ["children"] as const,
  yaml: [] as const,
};

export const mdcNodeTypes: string[] = Object.keys(visitorKeys);
