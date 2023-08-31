import { invariant } from '@roenlie/mimic-core/validation';
import type { PropertyDeclaration } from 'lit';

import { component, getCurrentRef } from '../core/component.js';
import { Prop } from '../utilities/prop.js';


export const useProperty = <T>(
	name: string,
	value: T,
	options: PropertyDeclaration<T> = {},
) => {
	type Property<T> = readonly [{ value: T; }, (value: T) => void];

	const cls = getCurrentRef();
	invariant(cls, 'Could not get base component');

	cls.properties ??= {};
	Object.assign(cls.properties, { [name]: options });

	component.sideEffects.add(element => Prop.bind(reactive, name, element));

	const reactive = new Prop<T>(value);

	return [ reactive.getter(), reactive.setter ] as Property<T>;
};


export const useState = <T>(
	name: string,
	value: T,
	options: PropertyDeclaration<T>,
) => useProperty(name, value, { ...options, state: true });
