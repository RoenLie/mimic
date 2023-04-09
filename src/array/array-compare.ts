/**
 * Does the array contain all of the other items?
 */
export const arrayContainsAll = <T>(array: Array<T>, other: Array<T>) => {
	return other.every((otherItem) => {
		return array.some((arrayItem) => {
			return arrayItem === otherItem;
		});
	});
};
