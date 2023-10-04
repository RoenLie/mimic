import { type RecordOf, type stringliteral } from '@roenlie/mimic-core/types';
import { type LitElement } from 'lit';
import { state } from 'lit/decorators.js';


export interface ContextProp<T = any> {value: T;}
export type ConsumeContextEvent<T = any> = CustomEvent<{prop: {value: T;} }>;

const providerHandlers = new WeakMap<object, Map<string, ((ev: Event) => any)[]>>();
const hydrateHandlers = new WeakMap<object, Map<string, ((ev: Event) => any)[]>>();

export const createEventName = (prop: string | symbol) => 'consume-context:' + prop.toString();
export const createHydrateName = (prop: string | symbol) => 'hydrate-context:' + prop.toString();

export const provide = <T extends any[]>(name: T[number] | stringliteral) => {
	return (target: RecordOf<LitElement>, prop: string) => {
		const connected = target.connectedCallback;
		const disconnected = target.disconnectedCallback;
		const update = target['update'];

		const hydrateName = createHydrateName(name);
		const eventName = createEventName(name);

		target.connectedCallback = function() {
			const provideHandler = (ev: Event) => {
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

			const map = providerHandlers.get(this) ?? (() => {
				return providerHandlers.set(this, new Map()).get(this)!;
			})();

			const handlers = map.get(eventName) ?? (() => {
				return map.set(eventName, []).get(eventName)!;
			})();

			handlers.push(provideHandler);

			connected.call(this);
		};

		target.disconnectedCallback = function() {
			const handlers = providerHandlers.get(this)?.get(eventName) ?? [];
			for (const handler of handlers)
				this.removeEventListener(eventName, handler);

			handlers.length = 0;

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
			globalThis.addEventListener(hydrateName, request);

			const map = hydrateHandlers.get(this) ??
				(() => hydrateHandlers.set(this, new Map()).get(this)!)();

			const handlers = map.get(eventName) ??
				(() => map.set(eventName, []).get(eventName)!)();

			handlers.push(request);

			connected.call(this);
		};

		const disconnected = target.disconnectedCallback;
		target.disconnectedCallback = function() {
			const handlers = hydrateHandlers.get(this)?.get(eventName) ?? [];
			for (const handler of handlers)
				this.removeEventListener(eventName, handler);

			handlers.length = 0;

			disconnected.call(this);
		};

		return state()(target, prop);
	};
};
