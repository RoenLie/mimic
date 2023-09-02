import { invariant } from '@roenlie/mimic-core/validation';
import type { LitElement, PropertyValues } from 'lit';

import { getCurrentRef } from '../core/component.js';


type UseUpdated = (
	func: (changedProps: PropertyValues, element: LitElement) => void,
	deps?: string[],
) => void;


export const useUpdated = ((
	func: (changedProps: PropertyValues, element: LitElement) => void,
	deps?: string[],
) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get base component');

	//@ts-ignore
	const native = cls.prototype.updated;
	//@ts-ignore
	cls.prototype.updated = function(props) {
		native.call(this, props);

		if (deps?.some(dep => props.has(dep)) ?? true)
			func(props, this);
	};
}) satisfies UseUpdated;
