import { html, LitElement } from 'lit';

import { consume, type ContextProp, provide } from '../../src/context.js';


export class IntroCmp extends LitElement {

	public static register() {
		globalThis.customElements.define('mm-intro', this);
	}

	protected override render() {
		return html`
		<mm-provider>
			<mm-consumer></mm-consumer>
		</mm-provider>
		`;
	}

}
IntroCmp.register();


class ProviderCmp extends LitElement {

	public static register() {
		globalThis.customElements.define('mm-provider', this);
	}

	@provide('label') public label = 'this is the label';

	protected override createRenderRoot(): Element | ShadowRoot {
		return this;
	}

}
ProviderCmp.register();


class ConsumerCmp extends LitElement {

	public static register() {
		globalThis.customElements.define('mm-consumer', this);
	}

	@consume('label') public label: ContextProp<string>;

	protected override render(): unknown {
		return html`
		${ this.label.value }

		<button @click=${ () => this.label.value = Math.random().toString() }>
			Math!
		</button>
		`;
	}

}
ConsumerCmp.register();
