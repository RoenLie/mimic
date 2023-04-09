/**
 * Returns a random element of an array
 */
export function randomElement<Type>(array: Type[]): Type {
	if (array.length == 0)
		throw new RangeError('No elements in array');

	let randomIndex = Math.floor(Math.random() * array.length);

	return array[randomIndex]!;
}
