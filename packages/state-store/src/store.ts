import { lazyMap, lazyWeakmap } from '@roenlie/mimic-core/structs';
import type { ReactiveControllerHost } from 'lit';

// TODO
// Add the same weakref cleanup for listeners as was added to observers.


export interface UpdatableElement {
	requestUpdate: Function;
}


export class StateStore {

	/** Handlers used through the proxy, which intercept any get or set on the store. */
	static #proxyHandlers = {
		get(target: StateStore, key: keyof StateStore) {
			if (key as string === '__origin')
				return target;

			return target[key];
		},
		set(target: StateStore, key: keyof StateStore, value: any) {
			if (key in target && target[key] === value)
				return true;

			try {
				return Reflect.set(target, key, value);
			}
			finally {
				StateStore.#notify(target, key);
			}
		},
	};

	/** Runs rerender requests and the listener functions upon change or update of a property. */
	static #notify(target: StateStore, key: keyof StateStore) {
		const observerMap = StateStore.#observers.get(target);
		for (const [ _key, set ] of observerMap ?? []) {
			if (_key !== key)
				continue;

			for (const ref of set) {
				const el = ref.deref();
				!el ? set.delete(ref) : el.requestUpdate();
			}
		}

		const listenerMap = StateStore.#listeners.get(target);
		for (const map of listenerMap?.values() ?? []) {
			const listeners = map.get(key);
			listeners?.forEach(listener => listener());
		}
	}

	static #observers = new WeakMap<StateStore, Map<string, Set<WeakRef<UpdatableElement>>>>();
	static #listeners = new WeakMap<StateStore, Map<object, Map<string, Set<Function>>>>();
	static #refRegistry = new FinalizationRegistry<{origin: StateStore; ref: WeakRef<any>;}>(
		({ origin, ref }) => {
			const map = StateStore.#observers.get(origin);
			for (const set of map?.values() ?? [])
				set.delete(ref);
		},
	);

	/**
	 * This is accessed through the proxy,
	 * as that's the only scenario you need to get a reference to the origin.
	 */
	private __origin: this;

	constructor() {
		return new Proxy<StateStore>(this, StateStore.#proxyHandlers);
	}

	/**
	 * Updates a value in the store, without replacing the original reference.
	 * Causes listeners and observers to activate after use.
	 */
	public update<T extends keyof Omit<this, keyof StateStore>>(
		prop: T,
		/**
		 * Function that mutates the object in the store.
		 * Return false to not trigger a rerender.
		 */
		mutate: (value: this[T]) => void | false,
	) {
		const rerender = mutate(this.__origin[prop]);
		if (rerender ?? true)
			StateStore.#notify(this.__origin, prop as keyof StateStore);
	}

	/**
	 * Registers a listener function that runs when the property is either set or updated.
	 */
	public listen(
		object: object,
		prop: keyof Omit<this, keyof StateStore>,
		func: () => any,
	) {
		const _prop = prop as string;

		const elementMap = lazyWeakmap(StateStore.#listeners, this.__origin, () => new Map());
		const propMap = lazyMap(elementMap, object, () => new Map());
		const funcSet = lazyMap(propMap, _prop, () => new Set());

		funcSet.add(func);
	}

	/** Removes a listener from the store. */
	public unlisten(
		object: object,
		prop: keyof Omit<this, keyof StateStore>,
		func?: () => void,
	) {
		const _prop = prop as string;

		const elementMap = lazyWeakmap(StateStore.#listeners, this.__origin, () => new Map());
		const propMap = lazyMap(elementMap, object, () => new Map());
		const funcSet = lazyMap(propMap, _prop, () => new Set());

		if (func)
			funcSet.delete(func);
		else
			funcSet.clear();
	}

	/** Removes all listeners in the store from its connected object */
	public unlistenAll(object: object) {
		StateStore.#listeners.get(this.__origin)?.get(object)?.forEach(set => set.clear());
		StateStore.#listeners.get(this.__origin)?.get(object)?.clear();
	}

	/**
	 * Registers the supplied element as wanting to be rerendered
	 * upon a set or update of the properties supplied
	 */
	public observe(
		element: UpdatableElement,
		...props: (keyof Omit<this, keyof StateStore>)[]
	) {
		const map = lazyWeakmap(StateStore.#observers, this.__origin, () => new Map());

		for (const prop of props as string[]) {
			if (!(prop in this.__origin))
				throw new Error('property: ' + prop + ' does not exist in the store.');

			const propMap = lazyMap(map, prop, new Set());
			const ref = new WeakRef(element);
			propMap.add(ref);

			StateStore.#refRegistry.register(element, { origin: this.__origin, ref }, element);
		}
	}

	/** Removes a property from the supplied elements observed list. */
	public unobserve(
		element: UpdatableElement,
		...props: (keyof Omit<this, keyof StateStore>)[]
	) {
		const map = StateStore.#observers.get(this.__origin);
		for (const prop of props as string[]) {
			const set = map?.get(prop);
			for (const ref of set ?? []) {
				if (ref.deref() !== element)
					continue;

				set?.delete(ref);
				StateStore.#refRegistry.unregister(element);
			}
		}
	}

	/** Removes all observed properties from an element reference. */
	public unobserveAll(element: UpdatableElement) {
		const map = StateStore.#observers.get(this.__origin);
		for (const set of map?.values() ?? []) {
			for (const ref of set) {
				if (ref.deref() !== element)
					continue;

				set.delete(ref);
				StateStore.#refRegistry.unregister(element);
			}
		}
	}

	/**
	 * Connects a controller to the supplied element.
	 * Allowing the controller to automatically handle cleanup
	 * of any observers or listeners upon disconnecting.
	 * Also takes in a rest arg of props, which are props that will be observed
	 */
	public connect(
		element: ReactiveControllerHost,
		...props: (keyof Omit<this, keyof StateStore>)[]
	) {
		this.observe(element, ...props);

		element.addController({
			hostDisconnected: () => {
				this.unlistenAll(element);
				this.unobserveAll(element);
			},
		});
	}

	/** Completely removes all listeners and observers from the store this is used from. */
	public dispose() {
		StateStore.#observers.get(this.__origin)?.forEach(map => {
			map.clear();
		});
		StateStore.#observers.delete(this.__origin);

		StateStore.#listeners.get(this.__origin)?.forEach(map => {
			map.forEach(set => set.clear()), map.clear();
		});
		StateStore.#listeners.delete(this.__origin);
	}

}
