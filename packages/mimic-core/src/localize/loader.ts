import { lazyMap } from '../utils/structs/lazy-map.js';
import { DynamicImport, LanguageCode, localizeData, update } from './localize.js';


export interface LanguageExport extends Record<LanguageCode, DynamicImport> {}


export const translationLoader = async (...languageExports: LanguageExport[]) => {
	/** Push all language export functions together under their respective language code. */
	languageExports.forEach((langExport) => {
		Object.entries(langExport).forEach(([ langCode, langFn ]) => {
			const langArr = lazyMap(localizeData.languageStore, langCode, () => []);
			langArr.push(langFn);
		});
	});

	await update();
};
