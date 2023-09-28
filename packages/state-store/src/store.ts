import { lazyMap, lazyWeakmap } from '@roenlie/mimic-core/structs';
import type { ReactiveControllerHost } from 'lit';


export interface UpdatableElement {
	requestUpdate: Function;
}

type ListenerRefMap = Map<ObjectRef, ListenerMap>;
type ObjectRef = WeakRef<object>;
type ListenerMap = Map<Function, ListenerOptions>
interface ListenerOptions {type: 'before' | 'after', priority: number}


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
		for (const [ _key, map ] of listenerMap ?? []) {
			if (_key !== key)
				continue;

			for (const [ ref, listeners ] of map) {
				if (!ref.deref()) {
					map.delete(ref);
					continue;
				}

				for (const [ listener, options ] of listeners)
					listener();
			}
		}
	}

	//TODO make some stuff where you can trigger listeners before mutations.
	// Must handle the update function case as well as a normal setter case.
	// Registry has already been updated to hold a map instead of a set, so that we can hold options.
	// URGENT; MUST; HAVE; FOR PROJECT MORPH.

	static #observers = new WeakMap<StateStore, Map<string, Set<WeakRef<UpdatableElement>>>>();
	static #listeners = new WeakMap<StateStore, Map<string, ListenerRefMap>>();
	static #refRegistry = new FinalizationRegistry<{origin: StateStore; ref: WeakRef<any>;}>(
		({ origin, ref }) => {
			const obsMap = StateStore.#observers.get(origin);
			for (const set of obsMap?.values() ?? [])
				set.delete(ref);

			const lisMap = StateStore.#listeners.get(origin);
			for (const [ , map ] of lisMap ?? [])
				map.delete(ref);
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
		reference: object,
		prop: keyof Omit<this, keyof StateStore>,
		func: () => any,
		options?: ListenerOptions,
	) {
		const _prop = prop as string;
		const elementMap = lazyWeakmap(StateStore.#listeners, this.__origin, () => new Map());
		const propMap = lazyMap(elementMap, _prop, () => new Map());

		let funcEntry = [ ...propMap.entries() ].find(([ ref ]) => ref.deref() === reference);
		if (!funcEntry) {
			const ref = new WeakRef(reference);
			const funcMap: ListenerMap = new Map();
			propMap.set(ref, funcMap);
			StateStore.#refRegistry.register(reference, { origin: this.__origin, ref }, reference);

			funcEntry = [ ref, funcMap ] as [ObjectRef, ListenerMap];
		}

		funcEntry[1].set(func, options ?? { priority: 100, type: 'after' });
	}

	/** Removes a listener from the store. */
	public unlisten(
		reference: object,
		prop: keyof Omit<this, keyof StateStore>,
		func?: () => void,
	) {
		const _prop = prop as string;

		const map = StateStore.#listeners.get(this.__origin);
		const propMap = map?.get(_prop);
		for (const [ ref, map ] of propMap ?? []) {
			const obj = ref.deref();
			if (!obj) {
				propMap?.delete(ref);
				continue;
			}

			if (obj !== reference)
				continue;

			if (!func) {
				map.clear();
				continue;
			}

			map.delete(func);
		}
	}

	/** Removes all listeners in the store from its connected object */
	public unlistenAll(reference: object) {
		const storeMap = StateStore.#listeners.get(this.__origin);
		for (const [ prop, refMap ] of storeMap ?? []) {
			for (const ref of refMap.keys()) {
				const obj = ref.deref();
				if (!obj) {
					refMap.delete(ref);
					continue;
				}

				if (obj !== reference)
					continue;

				refMap.delete(ref);
				StateStore.#refRegistry.unregister(reference);
			}

			if (!refMap.size)
				storeMap?.delete(prop);
		}
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

		const controller = {
			hostDisconnected: () => {
				this.unlistenAll(element);
				this.unobserveAll(element);
				element.removeController(controller);
			},
		};

		element.addController(controller);
	}

	/** Completely removes all listeners and observers from the store this is used from. */
	public dispose() {
		// Clear all observers
		for (const [ , set ] of StateStore.#observers.get(this.__origin) ?? [])
			set.clear();

		StateStore.#observers.delete(this.__origin);

		// Clear all listeners
		for (const [ , map ] of StateStore.#listeners.get(this.__origin) ?? []) {
			for (const [ , set ] of map)
				set.clear();

			map.clear();
		}
		StateStore.#listeners.delete(this.__origin);
	}

}
