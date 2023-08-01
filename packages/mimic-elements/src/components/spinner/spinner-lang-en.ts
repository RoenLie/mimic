import { type DefaultTranslation, registerTranslation } from '@roenlie/mimic-core/localize';


export const spinnerLang: DefaultTranslation = {
	$code: 'en',
	$name: 'English',
	$dir:  'ltr',

	loading: 'Loading',
};


export default (async () => {
	registerTranslation(spinnerLang);
})();
