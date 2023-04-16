import { clone, lazyMap, lazyWeakmap } from '@roenlie/mimic-core/structs';


type Updateable = { requestUpdate: () => void; };


type Observer<T = any> = (newValue: T, oldValue: T) => void;


type Unobserve = () => void;


const generatorFns = {
	set:     () => new Set(),
	map:     () => new Map(),
	weakmap: () => new WeakMap(),
};


export class LitStateStore {

	#properties: Record<string, any> = clone(Reflect.getMetadata($StoreProp, this));
	#listeners:          Map<string, Set<WeakRef<Updateable>>> = new Map();
	#mapToObserver:      Map<string, WeakMap<Updateable, Set<Observer>>> = new Map();
	#trackedObservers:   Map<string, Set<WeakRef<Updateable>>> = new Map();
	#untrackedObservers: Map<string, Set<Observer>> = new Map();

	constructor() {
		this.#initializeProperties();
	}

	#initializeProperties(this: LitStateStore & Record<keyof any, any>) {
		Object.entries(this.#properties ?? {}).forEach(([ key ]) => {
			this[key] = {
				get: (el?: Updateable) => {
					if (el) {
						let set = lazyMap(this.#listeners, key, generatorFns.set);
						set.add(new WeakRef(el));
					}

					return this.#properties![key];
				},
				set: (value: any) => {
					let oldValue = this.#properties[key];
					this.#properties[key] = value;
					this.#notifyChange(key, value, oldValue);

					return value;
				},
				update: (prop: string, value: any) => {
					let oldValue = this.#properties[key][prop];
					this.#properties[key][prop] = value;
					this.#notifyChange([ key, prop ].join('.'), value, oldValue);

					return this.#properties[key];
				},
				observe: (cb: (v: any) => void, el?: Updateable) => {
					if (el) {
						let refSet = lazyMap(this.#trackedObservers, key, generatorFns.set) as Set<WeakRef<Updateable>>;
						let ref = new WeakRef(el);
						refSet.forEach(r => r.deref() === el && (ref = r));
						refSet.add(ref);

						let map = lazyMap(this.#mapToObserver, key, generatorFns.weakmap);
						let observers = lazyWeakmap(map, el, generatorFns.set);
						observers.add(cb);

						return () => {
							observers.delete(cb);
							refSet.delete(ref);
						};
					}
					else {
						let set = lazyMap(this.#untrackedObservers, key, generatorFns.set);

						return () => {
							set.delete(cb);
						};
					}
				},
			};
		});
	}

	#notifyChange(key: string, newValue: any, oldValue: any) {
		const updateables = this.#listeners.get(key);
		updateables?.forEach(updateable => {
			const el = updateable.deref();
			el ? el.requestUpdate() : updateables.delete(updateable);
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


export type StoreProperty<T> = {
	get: (el?: Updateable) => T;
	set: (v: T) => T;
	update: <K extends keyof T>(prop: K, value: T[K]) => T;
	observe: (observer: Observer<T>, el?: Updateable) => Unobserve;
};


export const StoreProp = (options: { value: any }) => {
	return (target: LitStateStore, propertyKey: string) => {
		const metadata = Reflect.getMetadata($StoreProp, target) ?? {};
		Object.assign(metadata, { [propertyKey]: options.value });
		Reflect.defineMetadata($StoreProp, metadata, target);
	};
};
