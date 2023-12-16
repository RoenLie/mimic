import type { Ctor } from '@roenlie/mimic-core/types';
import { LitElement, type PropertyValues } from 'lit';


/**
 * This decorator sets the static tagname prop on the component.
 *
 * But does not register the component in the global registry.
 *
 * Must be compatible with Lits customElement decorator parameters.
 *
 * As there are metadata libs that use the supplied tagname to extract data.
 */
export const customElement = (tagname: string, registerOnImport = false) => {
	return <TBase extends Ctor<typeof AegisElement>>(base: TBase) => {
		base.tagName = tagname;
		if (registerOnImport)
			base.register();

		return base;
	};
};


/**
 * Base class that can be used as a replacement for LitElement.
 *
 * Adds a method for registering the component manually instead of relying
 * on the lit default decorators auto registration.
 */
export class AegisElement extends LitElement {

	public static tagName: string;
	public static register(tagName = this.tagName) {
		if (!globalThis.customElements.get(tagName))
			globalThis.customElements.define(tagName, this);
	}

	/** Is true immediatly after connectedCallback and set to false after the first updated hook. */
	#firstUpdateAfterConnected = false;

	/**
	 * Is called on every connection of this element, after the first updated hook as been called.
	 *
	 * This is perfect for performing operations that require the dom to have rendered.
	 *
	 * If it's an operation that only needs to run once, you can use firstUpdated.
	 * But for code that must rerun on every reconnection, this is the place.
	 *
	 * @category lifecycle
	 */
	public afterConnectedCallback(): void { }


	public override connectedCallback(): void {
		super.connectedCallback();

		this.#firstUpdateAfterConnected = true;
	}

	protected override updated(changedProperties: PropertyValues<any>): void {
		super.updated(changedProperties);

		if (this.#firstUpdateAfterConnected) {
			this.#firstUpdateAfterConnected = false;

			requestAnimationFrame(() => this.afterConnectedCallback());
		}
	}

}
