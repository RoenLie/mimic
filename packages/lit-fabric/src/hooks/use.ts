import { invariant } from '@roenlie/mimic-core/validation';
import type { CSSResultGroup, LitElement, PropertyDeclaration, PropertyValues, ReactiveElement } from 'lit';

import { component, getCurrentRef } from '../core/component.js';


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


export const useStyles = (css: CSSResultGroup) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get base component');

	const existing = cls.styles ?? [];

	cls.styles = [	existing, css ];
};

export const useConnected = (func: (element: LitElement) => void) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get base component');

	const native = cls.prototype.connectedCallback;
	cls.prototype.connectedCallback = function() {
		native.call(this);
		func(this);
	};
};

export const useWillUpdate = (
	func: (changedProps: PropertyValues, element: LitElement) => void,
	deps?: string[],
) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get base component');

	//@ts-ignore
	const native = cls.prototype.willUpdate;
	//@ts-ignore
	cls.prototype.willUpdate = function(props) {
		native.call(this, props);

		if (deps?.some(dep => props.has(dep)) ?? true)
			func(props, this);
	};
};


export const useUpdate = (
	func: (changedProps: PropertyValues, element: LitElement) => void,
	deps?: string[],
) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get base component');

	//@ts-ignore
	const native = cls.prototype.update;
	//@ts-ignore
	cls.prototype.update = function(props) {
		native.call(this, props);

		if (deps?.some(dep => props.has(dep)) ?? true)
			func(props, this);
	};
};


export const useUpdated = (
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
};

export const useAfterConnected = (func: (element: LitElement) => void) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get base component');

	let firstUpdated = true;

	const {
		//@ts-ignore
		updated: nativeUpdated,
		connectedCallback: nativeConnected,
	} = cls.prototype;

	cls.prototype.connectedCallback = function() {
		nativeConnected.call(this);
		firstUpdated = true;
	};

	//@ts-ignore
	cls.prototype.updated = function(changedProps) {
		nativeUpdated.call(this, changedProps);
		if (firstUpdated) {
			firstUpdated = false;
			func(this);
		}
	};
};

export const useQuery = <T extends Element = HTMLElement>(name: string, selector: string, cache?: boolean) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get base component');

	const descriptor = {
		get(this: ReactiveElement) {
			return this.renderRoot?.querySelector(selector) || undefined;
		},
		enumerable:   true,
		configurable: true,
	};

	if (cache) {
		const key = `__${ name }`;
		descriptor.get = function(this: ReactiveElement) {
			const me = this as unknown as Record<string, Element | null>;
			if (me[key] === undefined)
				me[key] = this.renderRoot?.querySelector(selector) ?? null;

			return me[key]!;
		};
	}

	Object.defineProperty(cls.prototype, name, descriptor);

	class Getter<T = any> {

		public static bind(getter: Getter, name: string, ref: Record<keyof any, any>) {
			getter.#name = name;
			getter.#ref = new WeakRef(ref);
		}

		#name: string;
		#ref: WeakRef<Record<keyof any, any>>;

		public get value(): T {
			return this.#ref.deref()?.[this.#name];
		}

	}
	const getter = new Getter<T>();
	component.sideEffects.add((element) => Getter.bind(getter, name, element));

	return getter;
};
