import { css, html, LitElement } from 'lit';

import { type Context, ContextProvider } from '../../src/context.cmp.js';
import { consume, type ContextProp, provide } from '../../src/context.js';

ContextProvider.register();


export class IntroCmp extends LitElement {

	public static register() {
		globalThis.customElements.define('mm-intro', this);
	}

	protected context = {
		label:   'this is the label',
		counter: 0,
	};

	protected override render() {
		return html`
		<context-provider .context=${ this.context }>
			<mm-consumer></mm-consumer>
			<mm-consumer></mm-consumer>
			<mm-consumer></mm-consumer>
			<mm-consumer></mm-consumer>
		</context-provider>
		`;
	}

	public static override styles = css`
	:host {
		display: grid;
	}
	`;

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
	@consume('counter') public counter: ContextProp<number>;

	protected override render(): unknown {
		return html`
		${ this.label.value }
		${ this.counter.value }

		<button @click=${ () => this.counter.value++ }>
			Math!
		</button>
		`;
	}

}
ConsumerCmp.register();
