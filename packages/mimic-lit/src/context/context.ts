import { RecordOf } from '@roenlie/mimic-core/types';
import { LitElement } from 'lit';


type ConsumeContextEvent = CustomEvent<{value: any}>;


const createEventName = (prop: string) => 'consume-context:' + prop;


export const provide = () => {
	return (target: RecordOf<LitElement>, prop: string) => {
		const connected = target.connectedCallback;
		const disconnected = target.disconnectedCallback;

		const eventName = createEventName(prop);
		let provideHandler: (ev: Event) => any;

		target['connectedCallback'] = function() {
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

		target['disconnectedCallback'] = function() {
			this.removeEventListener(eventName, provideHandler);

			disconnected.call(this);
		};
	};
};


export const consume = () => {
	return (target: RecordOf<LitElement>, prop: string) => {
		const connected = target.connectedCallback;
		const eventName = createEventName(prop);

		target['connectedCallback'] = function() {
			const event = new CustomEvent(eventName, {
				bubbles:  true,
				composed: true,
				detail:   { value: undefined },
			});
			this.dispatchEvent(event);

			const value = event.detail.value;
			if (value)
				this[prop] = value;
			else
				console.error('Could not consume ' + prop);

			connected.call(this);
		};
	};
};
