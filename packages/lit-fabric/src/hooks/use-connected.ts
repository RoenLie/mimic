import { invariant } from '@roenlie/mimic-core/validation';
import type { LitElement } from 'lit';

import { getCurrentRef } from '../core/component.js';


type UseConnected = (
	func: (element: LitElement) => void,
) => void;


export const useConnected = ((func: (element: LitElement) => void) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get base component');

	const native = cls.prototype.connectedCallback;
	cls.prototype.connectedCallback = function() {
		native.call(this);
		func(this);
	};
}) satisfies UseConnected;
