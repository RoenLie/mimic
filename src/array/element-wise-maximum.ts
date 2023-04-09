export const elementWiseMaximum = (arrays: number[][]) => {
	// Find the length of the longest array
	let maxLength = 0;
	for (const array of arrays)
		maxLength = Math.max(maxLength, array.length);


	// Initialize the result array with the maximum values for each index
	const result: number[] = new Array(maxLength).fill(0);
	for (const array of arrays) {
		for (let i = 0; i < array.length; i++)
			result[i] = Math.max(result[i]!, array[i]!);
	}

	// Replace the remaining elements in the result array with the values from the longest array
	for (let i = 0; i < maxLength; i++) {
		if (result[i] === 0)
			result[i] = arrays[arrays.length - 1]![i]!;
	}

	return result;
};
