export interface LangBlock {
	[key: string]: LangBlock | string
}


export type LangMap = Map<string, Map<string, string>>;


export const createLangMapFromJson = (langBlock: LangBlock) => {
	const codeMap = new Map<string, Map<string, string>>();

	const processBlock = (prefix: string, obj: LangBlock) => {
		const entries = Object.entries(obj);
		entries.forEach(([ key, value ]) => {
			if (typeof value === 'string') {
				const map = codeMap.get(prefix) ?? (() =>
					codeMap.set(prefix, new Map()).get(prefix)!)();

				map.set(key, value);
			}
			else {
				processBlock((prefix ? prefix + '.' : '') + key, value);
			}
		});

		return codeMap;
	};

	return processBlock('', langBlock);
};


export const appendToLangMap = (langMap: LangMap, langBlock: LangBlock) => {
	const newLangMap = createLangMapFromJson(langBlock);

	for (const [ lang, map ] of langMap) {
		const newCodes = newLangMap.get(lang);
		for (const [ code, value ] of newCodes ?? [])
			map.set(code, value);
	}

	return langMap;
};
