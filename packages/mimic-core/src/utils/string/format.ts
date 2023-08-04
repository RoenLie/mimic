export const strFormat = (str: string, ...inputs: string[]) => {
	for (const propIndex in inputs) {
		const re = new RegExp('\\{' + propIndex + '}', 'gm');
		str = str.replace(re, inputs[propIndex] ?? '');
	}

	return str;
};
