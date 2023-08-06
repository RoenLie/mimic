import { LitElement } from 'lit';


interface TaggedElementConstructor {
	new(): HTMLElement;
	tagName: string;
}


export const customElement = (tag: string) => (constructor: TaggedElementConstructor) => {
	constructor.tagName = tag.toUpperCase();
	customElements.define(tag, constructor);
};


export class MimicElement extends LitElement {

	/** Returns the HTML-uppercased qualified name. */
	public static tagName: string;

}
