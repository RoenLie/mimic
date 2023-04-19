import { LitElement } from 'lit';
import { state } from 'lit/decorators.js';


type RecordOf<T> = T & Record<keyof any, any>;
type ConsumeContextEvent = CustomEvent<{value: any}>;


const createEventName = (prop: string) => 'consume-context:' + prop;
const createHydrateName = (prop: string) => 'hydrate-context:' + prop;


export const provide = (name: string) => {
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

				const event = ev as ConsumeContextEvent;
				event.detail.value = this[prop];
			};

			this.removeEventListener(eventName, provideHandler);
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
					bubbles:  true,
					composed: true,
				});

				this.dispatchEvent(ev);
			}
		};

		return state()(target, prop);
	};
};


export const consume = (name: string) => {
	return (target: RecordOf<LitElement>, prop: string) => {
		const connected = target.connectedCallback;
		const disconnected = target.disconnectedCallback;

		const eventName = createEventName(name);
		const hydrateName = createHydrateName(name);

		let hydrateHandler: (ev: Event) => any;

		target.connectedCallback = function() {
			const request = () => {
				const event = new CustomEvent(eventName, {
					bubbles:  true,
					composed: true,
					detail:   { value: undefined },
				});
				this.dispatchEvent(event);

				const value = event.detail.value;
				if (value !== undefined)
					this[prop] = value;
				else
					console.error('Could not consume ' + name);
			};

			request();

			hydrateHandler = () => request();
			globalThis.removeEventListener(hydrateName, hydrateHandler);
			globalThis.addEventListener(hydrateName, hydrateHandler);

			connected.call(this);
		};

		target.disconnectedCallback = function() {
			globalThis.removeEventListener(hydrateName, hydrateHandler);

			disconnected.call(this);
		};

		return state()(target, prop);
	};
};
