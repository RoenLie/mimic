import { invariant } from '@roenlie/mimic-core/validation';
import type { ReactiveElement } from 'lit';

import { component, getCurrentRef } from '../core/component.js';
import { Getter } from '../utilities/getter.js';

type UseQuery = <T extends Element = HTMLElement>(
	name: string,
	selector: string,
	cache?: boolean,
) => ({ value: T; });


export const useQuery = (<T extends Element = HTMLElement>(
	name: string,
	selector: string,
	cache?: boolean,
) => {
	const cls = getCurrentRef();
	invariant(cls, 'Could not get base component');

	const descriptor = {
		get(this: ReactiveElement) {
			return this.renderRoot?.querySelector(selector) || undefined;
		},
		enumerable:   true,
		configurable: true,
	};

	if (cache) {
		const key = `__${ name }`;
		descriptor.get = function(this: ReactiveElement) {
			const me = this as unknown as Record<string, Element | null>;
			if (me[key] === undefined)
				me[key] = this.renderRoot?.querySelector(selector) ?? null;

			return me[key]!;
		};
	}

	Object.defineProperty(cls.prototype, name, descriptor);

	const getter = new Getter<T>();
	component.sideEffects.add((element) => Getter.bind(getter, name, element));

	return getter;
}) satisfies UseQuery;
