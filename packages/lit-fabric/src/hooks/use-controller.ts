import { invariant } from '@roenlie/mimic-core/validation';
import type { LitElement, ReactiveController } from 'lit';

import { component, getCurrentRef } from '../core/component.js';
import { Getter } from '../utilities/getter.js';


type UseController = <T extends ReactiveController = ReactiveController>(
	name: string,
	controller: T,
) => ({ value: T; });


export const useController = (<T extends ReactiveController>(
	name: string, controller: ((element: LitElement) => T) | T,
) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get base component');

	const getter = new Getter<T>();
	component.sideEffects.add((element) => {
		element.addController(typeof controller === 'function'
			? controller(element) : controller);

		Getter.bind(getter, name, element);
	});

	return getter;
}) satisfies UseController;
