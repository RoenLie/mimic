import type { RecordOf } from '@roenlie/mimic-core/types';
import { css, html, LitElement, type PropertyValues } from 'lit';
import { property } from 'lit/decorators.js';

import { type ConsumeContextEvent, createEventName, createHydrateName } from './context.js';


declare global { interface HTMLElementTagNameMap {
	'context-provider': ContextProvider;
} }


export interface Context { name: string; value: any }


export class ContextProvider extends LitElement {

	public static tagName = 'context-provider';
	public static register() {
		if (!globalThis.customElements.get(this.tagName))
			globalThis.customElements.define(this.tagName, this);
	}

	@property({ type: Array }) public context: Context[];
	#listeners: {name: string; listener: (ev: Event) => any;}[] = [];

	protected setupContext() {
		// Remove all old listeners when a new context array has been assigned.
		this.#listeners.forEach(({ name, listener }) => {
			this.removeEventListener(name, listener);
		});
		this.#listeners.length = 0;

		// Hook up the new context listeners.
		this.context.forEach(context => {
			const eventName = createEventName(context.name);
			const provideHandler = (ev: Event) => {
				ev.preventDefault();
				ev.stopPropagation();
				ev.stopImmediatePropagation();

				const me = this as RecordOf<this>;
				const event = ev as ConsumeContextEvent;
				event.detail.prop = {
					get value() {
						return me.context.find(ct => ct.name === context.name)?.value;
					},
					set value(value: any) {
						const ct = me.context.find(ct => ct.name === context.name);
						if (!ct)
							return;

						const oldValue = ct.value;
						if (oldValue === value)
							return;

						ct.value = value;

						const hydrateName = createHydrateName(context.name);
						const ev = new CustomEvent(hydrateName, {
							bubbles:    true,
							composed:   true,
							cancelable: false,
						});

						globalThis.dispatchEvent(ev);
					},
				};
			};

			this.#listeners.push({ name: eventName, listener: provideHandler });
			this.addEventListener(eventName, provideHandler);
		});
	}

	public override connectedCallback(): void {
		this.setupContext();
		super.connectedCallback();
	}

	protected override willUpdate(changedProps: PropertyValues): void {
		super.willUpdate(changedProps);
		if (!changedProps.has('context') || !this.hasUpdated)
			return;

		this.setupContext();
	}

	protected override render(): unknown {
		return html`<slot></slot>`;
	}

	public static override styles = css`
	:host {
		display: contents;
	}
	`;

}
