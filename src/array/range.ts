/**
 * Creates an array of numbers from first to last.
 */
export const range = (first: number, last?: number, step = 1) => {
	if (last === undefined) {
		last = first;
		first = 0;
	}

	if (first > last) {
		let temp = last;
		last = first;
		first = temp;
	}

	const result: number[] = [];
	for (let i = first; i < last; i += step)
		result.push(i);

	return result;
};
