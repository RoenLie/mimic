export const ensureCE = (customElement: CustomElementConstructor & {tagName: string}) => {
	const tag = customElement.tagName;

	if (!globalThis.customElements.get(tag))
		globalThis.customElements.define(tag, customElement);
};
