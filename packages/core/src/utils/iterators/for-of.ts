export const forOf = <T extends Iterable<any>[]>(...iterables: T) => new ForOf(iterables);


class ForOf<T extends Iterable<any>[]> {

	#iterables: T;

	constructor(iterables: T) {
		this.#iterables = iterables;
	}

	public find(
		predicate: (value: IterableTupleToUnion<T>, index: number, obj: T[number]) => boolean,
	): IterableTupleToUnion<T> | undefined {
		for (const iterable of this.#iterables) {
			let index = 0;
			for (const value of iterable) {
				const result = predicate(value, index, iterable);
				if (result)
					return value;

				index++;
			}
		}
	}

}


type MapKeyValueType<T> = T extends Map<infer K, infer V> ? [K, V] : never;
type SetValueType<T> = T extends Set<infer V> ? V : never;
type GeneratorValueType<T extends Generator> = T extends Generator<infer A, infer B> ? A | B : never;


type UnwrapIterableTuple<T extends Iterable<any>> = {
	[K in keyof T]: T[K] extends any[] ? T[K][number]
		: T[K] extends Map<any, any>    ? MapKeyValueType<T[K]>
			: T[K] extends Set<any>      ? SetValueType<T[K]>
				: T[K] extends Generator  ? GeneratorValueType<T[K]>
					: never
} & Record<number, unknown>;

type IterableTupleToUnion<T extends Iterable<any>> = UnwrapIterableTuple<T>[number];
