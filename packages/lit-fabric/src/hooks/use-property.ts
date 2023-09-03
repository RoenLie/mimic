import { invariant } from '@roenlie/mimic-core/validation';
import type { PropertyDeclaration } from 'lit';

import { getCurrentRef } from '../core/component.js';


type UseProperty<T = any> = (
	name: string,
	initialValue: T,
	options?: PropertyDeclaration<T>
) => readonly [ { value: T; }, (value: T) => void ];


export const useProperty = (<T>(
	name: string,
	initialValue: T,
	options: PropertyDeclaration<T> = {},
) => {
	type Property<T> = readonly [{ readonly value: T; }, (value: T) => void];

	const cls = getCurrentRef();
	invariant(cls, 'Could not get component instance.');

	cls.constructor.createProperty(name, options);
	(cls as any)[name] = initialValue;

	const setter = (value: T) => (cls as any)[name] = value;
	const getter = {
		get value() {
			return (cls as any)[name];
		},
	};

	return [
		getter,
		setter,
	] as Property<T>;
}) satisfies UseProperty;


export const useState = (<T>(
	name: string,
	initialValue: T,
	options?: PropertyDeclaration<T>,
) => useProperty(
	name,
	initialValue,
	{ ...options, state: true },
)) satisfies UseProperty;
