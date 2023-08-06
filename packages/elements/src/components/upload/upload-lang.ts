import { type LanguageExport } from '@roenlie/mimic-core/localize';


export const uploadTranslation: LanguageExport = {
	en: () => import('./upload-lang-en.js'),
};
