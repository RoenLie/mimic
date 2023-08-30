import type { CSSResultGroup, LitElement, PropertyDeclaration } from 'lit';

import { component } from './component.js';


class Reactive<T = any> {

	public static bind(obj: Reactive, name: string, ref: Record<keyof any, any>) {
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


export function useProperty<TType>(
	prop: {name: string; value: TType;} & PropertyDeclaration,
	cls: typeof LitElement,
) {
	console.log(this);

	cls.properties ??= {};
	Object.assign(cls.properties, { [prop.name]: prop });

	function sideEffect(this: LitElement) {
		Reactive.bind(reactive, prop.name, this);
	}

	component.sideEffects.add(sideEffect);

	const reactive = new Reactive<TType>(prop.value);

	return [ reactive.getter(), reactive.setter ] as const;
}


export const useState = <TType>(
	prop: {name: string; value: TType;} & PropertyDeclaration,
	cls: typeof LitElement,
) => {
	cls.properties ??= {};
	Object.assign(cls.properties, { [prop.name]: { ...prop, state: true } });

	function sideEffect(this: LitElement) {
		Reactive.bind(reactive, prop.name, this);
	}

	component.sideEffects.add(sideEffect);

	const reactive = new Reactive<TType>(prop.value);

	return [ reactive.getter(), reactive.setter ] as const;
};


export const useStyles = (css: CSSResultGroup, cls: typeof LitElement) => {
	const existing = cls.styles ?? [];

	cls.styles = [	existing, css ];
};
