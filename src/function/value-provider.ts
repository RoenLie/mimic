import { ValueProvider } from '../types/delegates.types.js';


/** Get the value provided by the `valueProvider`. */
export const resolveValueProvider = <T>(valueProvider: ValueProvider<T>) => {
	return typeof valueProvider === 'function' ? (valueProvider as () => T)() : valueProvider;
};
