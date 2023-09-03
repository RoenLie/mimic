import { noop } from '@roenlie/mimic-core/function';
import { invariant } from '@roenlie/mimic-core/validation';
import { LitElement } from 'lit';

import { component, getCurrentRef } from '../core/component.js';


type UseElement = (
	func: (element: LitElement) => any,
) => any;


export const useElement = (<T extends (...args: any[]) => any>(
	func: (element: LitElement) => T,
) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get base component');

	const getter: { func: T } = { func: noop as T };
	component.sideEffects.add(element => getter.func = func(element));

	return getter;
}) satisfies UseElement;
