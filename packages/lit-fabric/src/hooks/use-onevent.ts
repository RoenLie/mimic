import { invariant } from '@roenlie/mimic-core/validation';
import type { LitElement } from 'lit';

import { getCurrentRef } from '../core/component.js';


type UseOnEvent = (
	eventName: string,
	func: (event: Event, element: LitElement) => any,
) => any;


export const useOnEvent = (<T extends Event>(
	eventName: string,
	func: (event: T, element: LitElement) => any,
) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get base component');

	let fn = (_ev: Event) => {};

	const nativeConnectedCallback = cls.prototype.connectedCallback;
	cls.prototype.connectedCallback = function() {
		nativeConnectedCallback.call(this);

		fn = (ev: Event) => func(ev as T, this);
		this.addEventListener(eventName, fn);
	};

	const nativeDisconnectedCallback = cls.prototype.disconnectedCallback;
	cls.prototype.disconnectedCallback = function() {
		nativeDisconnectedCallback.call(this);

		this.removeEventListener(eventName, fn);
	};
}) satisfies UseOnEvent;
