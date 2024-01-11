import { css, html, LitElement } from 'lit';
import { state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { type Context, ContextProvider } from '../../src/context.cmp.js';
import { consume, type ContextProp, provide } from '../../src/context.js';

ContextProvider.register();


export class IntroCmp extends LitElement {

	public static register() {
		globalThis.customElements.define('mm-intro', this);
	}

	@state() protected show = true;

	protected context = {
		label:   'this is the label',
		counter: 0,
	};

	protected override render() {
		return html`
		<context-provider .context=${ this.context }>
			<button @click=${ () => this.show = !this.show }>Toggle</button>
			${ when(this.show, () => html`
			<mm-consumer></mm-consumer>
			<mm-consumer></mm-consumer>
			<mm-consumer></mm-consumer>
			<mm-consumer></mm-consumer>
			`) }
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

	protected override createRenderRoot() {
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
