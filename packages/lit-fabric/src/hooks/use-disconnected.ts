import { invariant } from '@roenlie/mimic-core/validation';
import type { LitElement } from 'lit';

import { getCurrentRef } from '../core/component.js';


type UseDisconnected = (
	func: (element: LitElement) => void,
) => void;


export const useDisconnected = ((func: (element: LitElement) => void) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get base component');

	const native = cls.prototype.disconnectedCallback;
	cls.prototype.disconnectedCallback = function() {
		native.call(this);
		func(this);
	};
}) satisfies UseDisconnected;