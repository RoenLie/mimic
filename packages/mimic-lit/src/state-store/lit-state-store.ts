import { clone, lazyMap, lazyWeakmap } from '@roenlie/mimic-core/structs';


type Updateable = { requestUpdate: () => void; };
type Observer<T = any> = (newValue: T, oldValue: T) => void;
type Unobserve = () => void;
type StoreProperties = Record<string, any>;
type ListenerMap = Map<string, Set<WeakRef<Updateable>>>;
type ListenerKeyMap = WeakMap<Updateable, string[]>;
type ObserverMap = Map<string, WeakMap<Updateable, Set<Observer>>>;
type TrackedObservers = Map<string, Set<WeakRef<Updateable>>>;
type UntrackedObservers = Map<string, Set<Observer>>;


export class LitStateStore {

	#properties:         StoreProperties = clone(Reflect.getMetadata($StoreProp, this));
	#listeners:          ListenerMap = new Map();
	#listenerKeyMap:     ListenerKeyMap = new WeakMap();
	#mapToObserver:      ObserverMap = new Map();
	#trackedObservers:   TrackedObservers = new Map();
	#untrackedObservers: UntrackedObservers = new Map();


	constructor() {
		this.#initializeProperties();
	}

	#propGet(el: Updateable | undefined, key: string): unknown {
		if (el) {
			const keys = lazyWeakmap(this.#listenerKeyMap, el, []);
			if (this.#listenerKeyMap.get(el)?.includes(key))
				return this.#properties![key];

			keys.push(key);
			let set = lazyMap(this.#listeners, key, () => new Set());
			set.add(new WeakRef(el));
		}

		return this.#properties![key];
	}

	#propSet<T>(key: string, value: T): T {
		let oldValue = this.#properties[key];
		this.#properties[key] = value;
		this.#notifyChange(key, value, oldValue);

		return value;
	}

	#propUpdate<T>(key: string, delegate: (v: T) => void): T {
		let oldValue = clone(this.#properties[key]);
		delegate(this.#properties[key]);
		this.#notifyChange(key, this.#properties[key], oldValue);

		return this.#properties[key];
	}

	#propObserver(key: string, cb: (v: any) => void, el: Updateable | undefined): Unobserve {
		if (el) {
			let refSet = lazyMap(this.#trackedObservers, key, () => new Set());
			let ref = new WeakRef(el);
			refSet.forEach(r => r.deref() === el && (ref = r));
			refSet.add(ref);

			let map = lazyMap(this.#mapToObserver, key, () => new WeakMap());
			let observers = lazyWeakmap(map, el, () => new Set());
			observers.add(cb);

			return () => {
				observers.delete(cb);
				refSet.delete(ref);
			};
		}
		else {
			let set = lazyMap(this.#untrackedObservers, key, () => new Set());

			return () => {
				set.delete(cb);
			};
		}
	}

	#initializeProperties(this: LitStateStore & Record<keyof any, any>) {
		for (const key of Object.keys(this.#properties)) {
			this[key] = {
				get:     (el?: Updateable) => this.#propGet(el, key),
				set:     (value: any) => this.#propSet(key, value),
				update:  (delegate: (v: any) => void) => this.#propUpdate(key, delegate),
				observe: (el: Updateable | ((v: any) => void), cb: (v: any) => void) => {
					if (typeof el === 'function')
						this.#propObserver(key, el, undefined);
					else
						this.#propObserver(key, cb, el);
				},
			};
		}
	}

	#notifyChange(key: string, newValue: any, oldValue: any) {
		const updateables = this.#listeners.get(key);
		updateables?.forEach(updateable => {
			const el = updateable.deref();
			if (el)
				el.requestUpdate();
			else
				updateables.delete(updateable);
		});

		const tracked = this.#trackedObservers.get(key);
		tracked?.forEach((ref) => {
			const el = ref.deref();
			if (el) {
				const weakmap = this.#mapToObserver.get(key);
				const observers = weakmap?.get(el);
				observers?.forEach(observer => observer(newValue, oldValue));
			}
			else {
				tracked.delete(ref);
			}
		});

		const untracked = this.#untrackedObservers.get(key);
		untracked?.forEach(observer => observer(newValue, oldValue));
	}

}


const $StoreProp = Symbol();


export type Stored<T> = {
	get(el: Updateable): T;
	get(): T;
	set: (v: T) => T;
	update: (delegate: (v: T) => void) => T;
	observe(el: Updateable, observer: Observer<T>): Unobserve;
	observe(observer: Observer<T>): Unobserve;
};


export const stored = (options?: { value?: any }) => {
	return (target: LitStateStore, propertyKey: string) => {
		const metadata = Reflect.getMetadata($StoreProp, target) ?? {};
		Object.assign(metadata, { [propertyKey]: options?.value ?? undefined });
		Reflect.defineMetadata($StoreProp, metadata, target);
	};
};
