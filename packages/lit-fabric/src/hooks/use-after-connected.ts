import { invariant } from '@roenlie/mimic-core/validation';
import type { LitElement } from 'lit';

import { getCurrentRef } from '../core/component.js';


type UseAfterConnected = (
	func: (element: LitElement) => void,
) => void;


export const useAfterConnected = ((func: (element: LitElement) => void) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get component instance.');

	let firstUpdated = true;

	const {
		//@ts-ignore
		updated: nativeUpdated,
		connectedCallback: nativeConnected,
	} = cls;

	cls.connectedCallback = function() {
		nativeConnected.call(this);
		firstUpdated = true;
	};

	//@ts-ignore
	cls.updated = function(changedProps) {
		nativeUpdated.call(this, changedProps);
		if (firstUpdated) {
			firstUpdated = false;
			func(this);
		}
	};
}) satisfies UseAfterConnected;
