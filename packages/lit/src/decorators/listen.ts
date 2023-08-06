import { typeOf } from '@roenlie/mimic-core/validation';


export const listen = <T extends string>(
	event: T | T[],
	options?: boolean | AddEventListenerOptions,
) => (
	target: HTMLElement & { connectedCallback: () => void; disconnectedCallback: () => void; },
	propertyKey: string,
	descriptor: PropertyDescriptor,
) => {
	const connected = target.connectedCallback;
	const disconnected = target.disconnectedCallback;

	const isString = typeOf(event).string();

	target.connectedCallback = function() {
		connected?.call(this);

		if (isString) {
			this.addEventListener(event as string, descriptor.value, options);

			return;
		}

		for (let i = 0; i < event.length; i++) {
			const eventName = event[ i ] || '';
			this.addEventListener(eventName, descriptor.value, options);
		}
	};

	target.disconnectedCallback = function() {
		disconnected?.call(this);

		if (isString) {
			this.removeEventListener(event as string, descriptor.value);

			return;
		}

		for (let i = 0; i < event.length; i++) {
			const eventName = event[ i ] || '';
			this.removeEventListener(eventName, descriptor.value);
		}
	};
};
