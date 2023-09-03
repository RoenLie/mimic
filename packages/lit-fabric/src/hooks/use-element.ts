import { noop } from '@roenlie/mimic-core/function';
import { invariant } from '@roenlie/mimic-core/validation';
import { LitElement } from 'lit';

import { component, getCurrentRef } from '../core/component.js';


type UseElement<T extends (element: LitElement) => any = any> = (
	func: T,
) => ReturnType<T>;


export const useElement = (<T extends (element: LitElement) => (...args: any[]) => any>(
	func: T,
) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get base component');

	let fn = noop(undefined);
	component.sideEffects.add(element => fn = func(element));

	return ((...args: any[]) => fn(...args)) as ReturnType<T>;
}) satisfies UseElement;
