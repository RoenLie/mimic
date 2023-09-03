import { invariant } from '@roenlie/mimic-core/validation';
import type { LitElement, PropertyValues } from 'lit';

import { getCurrentRef } from '../core/component.js';


type UseUpdate = (
	func: (changedProps: PropertyValues, element: LitElement) => void,
	deps?: string[],
) => void;


export const useUpdate = ((
	func: (changedProps: PropertyValues, element: LitElement) => void,
	deps?: string[],
) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get component instance.');

	//@ts-ignore
	const native = cls.update;
	//@ts-ignore
	cls.update = function(props) {
		native.call(this, props);

		if (deps?.some(dep => props.has(dep)) ?? true)
			func(props, this);
	};
}) satisfies UseUpdate;
