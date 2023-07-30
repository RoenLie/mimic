interface KnownElement {
	new(): HTMLElement;
	tagName: string;
}

export const webComponent = (constructor: KnownElement) => {
	customElements.define(constructor.tagName, constructor);

	constructor.tagName = constructor.tagName.toUpperCase();
};
