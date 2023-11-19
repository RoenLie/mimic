const visitedObjects = new WeakSet();


export interface Change { path: string; oldValue?: any; newValue?: any; }


export const getObjectDiff = (
	obj1: Record<keyof any, any>,
	obj2?: Record<keyof any, any>,
	parentKey = '',
): Change[] => {
	const changedKeys: Change[] = [];

	if (visitedObjects.has(obj1) || (obj2 && visitedObjects.has(obj2))) {
		return changedKeys;
	}
	else {
		visitedObjects.add(obj1);
		obj2 && visitedObjects.add(obj2);
	}

	// Check keys in obj1
	for (const key in obj1) {
		const currentKey = parentKey ? `${ parentKey }.${ key }` : key;

		if (typeof obj1[key] === 'object' && typeof obj2?.[key] === 'object') {
			const nestedChanges = getObjectDiff(obj1[key], obj2[key], currentKey);
			changedKeys.push(...nestedChanges);
		}
		else if (obj1[key] !== obj2?.[key]) {
			if (typeof obj1[key] === 'object') {
				const nestedChanges = getObjectDiff(obj1[key], {}, currentKey);
				changedKeys.push(...nestedChanges);
			}
			else if (typeof obj2?.[key] === 'object') {
				const nestedChanges = getObjectDiff(obj2[key], {}, currentKey);
				changedKeys.push(...nestedChanges);
			}
			else {
				changedKeys.push({
					path:     currentKey,
					oldValue: obj1[key],
					newValue: obj2?.[key],
				});
			}
		}
	}

	// Check keys in obj2 that are not in obj1
	for (const key in obj2) {
		const currentKey = parentKey ? `${ parentKey }.${ key }` : key;

		if (!obj1.hasOwnProperty(key)) {
			if (typeof obj2[key] === 'object') {
				const nestedChanges = getObjectDiff({}, obj2[key], currentKey);
				changedKeys.push(...nestedChanges);
			}
			else {
				changedKeys.push({
					path:     currentKey,
					oldValue: undefined,
					newValue: obj2[key],
				});
			}
		}
	}

	return changedKeys;
};
