import { resolveValueProvider } from '../function/value-provider.js';

type Provider<T> = T | (() => T);


/**
 * Get a `TValue` from the `map`, and add it first if it doesn't already exist in the map.
 * @param map - The map containing values.
 * @param key - The key to use when retrieving a value.
 * @param valueProvider - The creator function or value to use when the key does not already exist in the map.
 * @param retrieveAction - An optional action to perform on the value when it already exists in the map.
 */
export const lazyMap = <TMap extends Map<any, any>>(
	map: TMap,
	key: Parameters<TMap['get']>['0'],
	valueProvider: Provider<Exclude<ReturnType<TMap['get']>, undefined>>,
	retrieveAction?: (value: Exclude<ReturnType<TMap['get']>, undefined>) => void,
): Exclude<ReturnType<TMap['get']>, undefined> => {
	if (map.has(key)) {
		const val = map.get(key)!;
		retrieveAction?.(val);

		return val;
	}

	const val = resolveValueProvider(valueProvider);
	map.set(key, val);

	return val;
};


/**
 * Wrapper for mapGetLazy that accepts weak map.
 *
 * {@link lazyMap}
 */
export const lazyWeakmap = <TMap extends WeakMap<object, any>>(
	map: TMap,
	key: Parameters<TMap['get']>['0'],
	valueProvider: Provider<Exclude<ReturnType<TMap['get']>, undefined>>,
	retrieveAction?: (value: Exclude<ReturnType<TMap['get']>, undefined>) => void,
): Exclude<ReturnType<TMap['get']>, undefined> => lazyMap(
	map as unknown as Map<any, any>,
	key,
	valueProvider,
	retrieveAction,
);
