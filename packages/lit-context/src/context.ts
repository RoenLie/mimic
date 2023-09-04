import { type RecordOf, type stringliteral } from '@roenlie/mimic-core/types';
import { type LitElement } from 'lit';
import { state } from 'lit/decorators.js';


type ConsumeContextEvent<T = any> = CustomEvent<{prop: {value: T;} }>;
export interface ContextProp<T = any> {value: T}

const createEventName = (prop: string) => 'consume-context:' + prop;
const createHydrateName = (prop: string) => 'hydrate-context:' + prop;


export const provide = <T extends any[]>(name: T[number] | stringliteral) => {
	return (target: RecordOf<LitElement>, prop: string) => {
		const connected = target.connectedCallback;
		const disconnected = target.disconnectedCallback;
		const update = target['update'];

		const hydrateName = createHydrateName(name);
		const eventName = createEventName(name);
		let provideHandler: (ev: Event) => any;

		target.connectedCallback = function() {
			provideHandler = (ev: Event) => {
				ev.preventDefault();
				ev.stopPropagation();
				ev.stopImmediatePropagation();

				const me = this as RecordOf<LitElement>;
				const event = ev as ConsumeContextEvent;
				event.detail.prop = {
					get value() {
						return me[prop];
					},
					set value(value: T) {
						me[prop] = value;
					},
				};
			};
			this.addEventListener(eventName, provideHandler);

			connected.call(this);
		};

		target.disconnectedCallback = function() {
			this.removeEventListener(eventName, provideHandler);
			disconnected.call(this);
		};

		target['update'] = function(changedProperties) {
			update.call(this, changedProperties);

			if (changedProperties.has(prop)) {
				const ev = new CustomEvent(hydrateName, {
					bubbles:    true,
					composed:   true,
					cancelable: false,
				});

				globalThis.dispatchEvent(ev);
			}
		};

		return state()(target, prop);
	};
};


export const consume = <T extends any[]>(name: T[number] | stringliteral) => {
	return (target: RecordOf<LitElement>, prop: string) => {
		const eventName = createEventName(name);
		const hydrateName = createHydrateName(name);

		let hydrateHandler: (ev: Event) => any;

		const connected = target.connectedCallback;
		target.connectedCallback = function() {
			const request = () => {
				const event = new CustomEvent(eventName, {
					bubbles:    true,
					composed:   true,
					cancelable: false,
					detail:     { prop: undefined },
				});
				this.dispatchEvent(event);

				const value = event.detail.prop;
				if (value !== undefined)
					this[prop] = value;
				else
					console.error('Could not consume ' + name);
			};

			request();

			hydrateHandler = () => request();
			globalThis.addEventListener(hydrateName, hydrateHandler);

			connected.call(this);
		};

		const disconnected = target.disconnectedCallback;
		target.disconnectedCallback = function() {
			globalThis.removeEventListener(hydrateName, hydrateHandler);

			disconnected.call(this);
		};

		return state()(target, prop);
	};
};
