import { resolveValueProvider } from '../function/value-provider.js';
import { ValueProvider } from '../types/delegates.types.js';


/**
 * Get a `TValue` from the `map`, and add it first if it doesn't already exist in the map.
 * @param map - The map containing values.
 * @param key - The key to use when retrieving a value.
 * @param valueProvider - The creator function or value to use when the key does not already exist in the map.
 * @param retrieveAction - An optional action to perform on the value when it already exists in the map.
 */
export const mapGetLazy = <TKey, TValue>(
	map: Map<TKey, TValue>,
	key: TKey,
	valueProvider: ValueProvider<TValue>,
	retrieveAction?: (value: TValue) => void,
) => {
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
 * {@link mapGetLazy}
 */
export const weakmapGetLazy = <TKey extends object, TValue>(
	map: WeakMap<TKey, TValue>,
	key: TKey,
	valueProvider: ValueProvider<TValue>,
	retrieveAction?: (value: TValue) => void,
) => mapGetLazy(map as Map<TKey, TValue>, key, valueProvider, retrieveAction);
