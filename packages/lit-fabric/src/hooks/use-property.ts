import { invariant } from '@roenlie/mimic-core/validation';
import type { PropertyDeclaration } from 'lit';

import { component, getCurrentRef } from '../core/component.js';


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

	component.sideEffects.add(element =>
		Prop.bind(reactive, name, element));

	const reactive = new Prop<T>(value);

	return [ reactive.getter(), reactive.setter ] as Property<T>;
};


export const useState = <T>(
	name: string,
	value: T,
	options: PropertyDeclaration<T>,
) => useProperty(name, value, { ...options, state: true });


class Prop<T = any> {

	public static bind(obj: Prop, name: string, ref: Record<keyof any, any>) {
		obj.#name = name;
		obj.#ref = new WeakRef(ref);
		obj.setter(obj.#initial);
	}

	#name: string;
	#ref?: WeakRef<Record<keyof any, any>>;
	#initial: T;

	constructor(initialValue: any) {
		this.#initial = initialValue;
	}

	public getter() {
		const prox = new Proxy<{value: T}>({ value: undefined as any }, {
			get: () => {
				const ref = this.#ref?.deref();

				return ref?.[this.#name] ?? this.#initial;
			},
		});

		return prox;
	}

	public setter = (value: T) => {
		const ref = this.#ref?.deref();
		if (ref)
			ref[this.#name] = value;
		else
			this.#initial = value;
	};

}
