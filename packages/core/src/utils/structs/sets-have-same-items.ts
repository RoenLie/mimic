export const setsHaveSameItems = (...sets: Set<any>[]): boolean => {
	if (sets.length === 0)
		return true;


	const firstSet = sets[0]!;
	const firstSetSize = firstSet.size;

	// Check if all sets have the same size
	for (const set of sets) {
		if (set.size !== firstSetSize)
			return false;
	}

	// Check if all sets have the same items
	for (const item of firstSet) {
		for (const set of sets) {
			if (!set.has(item))
				return false;
		}
	}

	return true;
};


export const getEqualItems = <T>(n: number, ...sets: Set<T>[]): Set<T> => {
	if (sets.length < 2)
		throw new Error('At least two sets are required');


	const intersection = <T>(setA: Set<T>, setB: Set<T>): Set<T> => {
		const result = new Set<T>();
		for (const item of setA) {
			if (setB.has(item))
				result.add(item);
		}

		return result;
	};

	let commonItems = new Set<T>();
	for (let i = 0; i < sets.length; i++) {
		commonItems = intersection(commonItems, sets[i]!);
		if (commonItems.size < n)
			break;
	}

	return commonItems;
};
