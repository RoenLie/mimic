import { sleep } from '@roenlie/mimic-core/async';
import type { LitElement } from 'lit';


type UpdatableElement = HTMLElement & {
	requestUpdate: Function;
	updateComplete: Promise<any>;
	isUpdatePending: boolean;
};


export class MimicStore {

	/** Handlers used through the proxy, which intercept any get or set on the store. */
	static #proxyHandlers = {
		get(target: MimicStore, key: keyof MimicStore) {
			if (key as string === '__origin')
				return target;

			return target[key];
		},
		set(target: MimicStore, key: keyof MimicStore, value: any) {
			if (key in target && target[key] === value)
				return true;

			try {
				return Reflect.set(target, key, value);
			}
			finally {
				MimicStore.#notify(target, key);
			}
		},
	};

	/** Runs rerender requests and the listener functions upon change or update of a property. */
	static #notify(target: MimicStore, key: keyof MimicStore) {
		const observerMap = MimicStore.#observers.get(target);
		if (observerMap) {
			for (const [ element, set ] of observerMap) {
				if (set.has(key)) {
					if (!element.isUpdatePending) {
						element.updateComplete.then(sleep).then(() => {
							if (!element.isUpdatePending)
								element.requestUpdate();
						});
					}
				}
			}
		}

		const listenerMap = MimicStore.#listeners.get(target);
		if (listenerMap) {
			listenerMap.forEach((set) => {
				const listeners = set.get(key);
				listeners?.forEach(listener => listener());
			});
		}
	}

	static #observers = new WeakMap<MimicStore, Map<UpdatableElement, Set<string>>>();
	static #listeners = new WeakMap<MimicStore, Map<object, Map<string, Set<() => any>>>>();

	/** This is accessed through the proxy,
	 *  as that's the only scenario you need to get a reference to the origin. */
	private __origin: this;

	constructor() {
		return new Proxy<MimicStore>(this, MimicStore.#proxyHandlers);
	}

	/** Updates a value in the store, without replacing the original reference.
	 *  Causes listeners and observers to activate after use. */
	public update<T extends keyof Omit<this, keyof MimicStore>>(
		prop: T,
		mutate: (value: this[T]) => void,
	) {
		mutate(this.__origin[prop]);
		MimicStore.#notify(this.__origin, prop as keyof MimicStore);
	}

	/** Registers a listener function that runs when the property is either set or updated.
	 */
	public listen(
		object: object,
		prop: keyof Omit<this, keyof MimicStore>,
		func: () => any,
	) {
		const _prop = prop as string;

		if (!MimicStore.#listeners.has(this.__origin))
			MimicStore.#listeners.set(this.__origin, new Map());

		const elementMap = MimicStore.#listeners.get(this.__origin)!;
		if (!elementMap.has(object))
			elementMap.set(object, new Map());

		const propMap = elementMap.get(object)!;
		if (!propMap.has(_prop))
			propMap.set(_prop, new Set());

		const funcSet = propMap.get(_prop)!;
		funcSet.add(func);
	}

	/** Removes a listener from the store. */
	public unlisten(
		object: object,
		prop: keyof Omit<this, keyof MimicStore>,
		func: () => void,
	) {
		const _prop = prop as string;

		if (!MimicStore.#listeners.has(this.__origin))
			MimicStore.#listeners.set(this.__origin, new Map());

		const elementMap = MimicStore.#listeners.get(this.__origin)!;
		if (!elementMap.has(object))
			elementMap.set(object, new Map());

		const propMap = elementMap.get(object)!;
		if (!propMap.has(_prop))
			propMap.set(_prop, new Set());

		const funcSet = propMap.get(_prop)!;
		funcSet.delete(func);
	}

	/** Removes all listeners in the store from its connected object */
	public unlistenAll(element: object) {
		MimicStore.#listeners.get(this.__origin)?.get(element)?.forEach(set => set.clear());
		MimicStore.#listeners.get(this.__origin)?.get(element)?.clear();
	}

	/** Registers the supplied element as wanting to be rerendered
	 * upon a set or update of the properties supplied */
	public observe(
		element: UpdatableElement,
		...props: (keyof Omit<this, keyof MimicStore>)[]
	) {
		if (!MimicStore.#observers.has(this.__origin))
			MimicStore.#observers.set(this.__origin, new Map());

		const map = MimicStore.#observers.get(this.__origin)!;

		if (!map.has(element))
			map.set(element, new Set());

		const elementMap = map.get(element)!;

		for (const prop of props as string[]) {
			if (!(prop in this.__origin))
				throw new Error('property: ' + prop + ' does not exist in the store.');

			elementMap.add(prop);
		}
	}

	/** Removes a property from the supplied elements observed list. */
	public unobserve(
		element: UpdatableElement,
		...props: (keyof Omit<this, keyof MimicStore>)[]
	) {
		if (!MimicStore.#observers.has(this.__origin))
			MimicStore.#observers.set(this.__origin, new Map());

		const map = MimicStore.#observers.get(this.__origin)!;

		const propSet = map.get(element);
		props.forEach(prop => propSet?.delete(prop as string));
	}

	/** Removes all observed properties from an element reference. */
	public unobserveAll(element: UpdatableElement) {
		MimicStore.#observers.get(this.__origin)?.get(element)?.clear();
	}

	/** Connects a controller to the supplied element.
	 * Allowing the controller to automatically handle cleanup
	 * of any observers or listeners upon disconnecting. */
	public connect(element: LitElement) {
		element.addController({
			hostDisconnected: () => {
				this.unlistenAll(element);
				this.unobserveAll(element);
			},
		});
	}

	/** Completely removes all listeners and observers from the store this is used from. */
	public dispose() {
		MimicStore.#observers.get(this.__origin)?.forEach(map => {
			map.clear();
		});
		MimicStore.#observers.delete(this.__origin);

		MimicStore.#listeners.get(this.__origin)?.forEach(map => {
			map.forEach(set => set.clear());
			map.clear();
		});
		MimicStore.#listeners.delete(this.__origin);
	}

}
