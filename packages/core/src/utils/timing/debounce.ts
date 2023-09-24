import type { AsyncFn, Fn } from '../../types/function.types.js';


/**
 * Returns the supplied function wrapped in a that runs only once, after a `delay`.
 *
 * Repeated calls to this function within the delay period will reset the timeout,
 * effectively delaying the call of the original function.
 */
export const debounce = <T extends (...args: any[]) => any>(
	func: T,
	delay = 0,
) => {
	let timeout: number;

	const fn = (...args: any[]) => {
		clearTimeout(timeout);
		timeout = setTimeout(() => func(...args), delay);
	};

	return fn as (...args: Parameters<T>) => void;
};


/**
 * Debounce implementation that returns a curry function used for assigning a callback
 * to each individual usage scenario.
 *
 * Using the curry functionality is not mandatory.
 * @example
 * ```ts
 * 	const debouncedFilter = debounce((value: string) => navMenuService.filterMenu(value), 500);
 *
 * 	debouncedFilter(value)(res => navMenu = res);
 * ```
 * .
 */
export const curryDebounce = <T extends Fn<any, ReturnType<T>> | AsyncFn<any, ReturnType<T>>>(
	func: T,
	delay = 0,
) => {
	const callbacks = new Map<string, Function>();
	let timer: number;

	const debounceFunc = (...args: any[]) => {
		clearTimeout(timer);

		timer = setTimeout(async () => {
			const result = await func(...args);

			callbacks.forEach(c => c(result));
			callbacks.clear();
		}, delay, ...args);

		return (callback: Fn) => {
			callbacks.set(callback.toString(), callback);
		};
	};

	return debounceFunc as unknown as (...args: Parameters<T>) =>
		(callback: (result: Awaited<ReturnType<T>>) => void) => void;
};


/**
 * Triggers the initial function immediatly on every successive call.
 * Activates a debounce that fulfills and triggers the debounce function
 * only if there has been a sufficient delay between activations.
 */
export const withDebounce = <T extends (...args: any[]) => any>(
	func: T,
	debounceFunc: () => any,
	delay: number,
) => {
	const deb = debounce(debounceFunc, delay);
	const fn = (...args: any[]) => {
		deb();

		return func(...args);
	};

	return fn as T;
};
