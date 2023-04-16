import { type Fn } from '../types/function.types.js';
import { type StringLiteral } from '../types/strings.types.js';


export type DynamicImport = () => Promise<unknown>;


export interface LanguageExport extends Record<LanguageCode, DynamicImport> {}


export type FunctionParams<T> = T extends (...args: infer U) => string ? U : never;


export type LocalizeDirection = 'ltr' | 'rtl' | StringLiteral;


export type LanguageCode = string;


export interface Translation {
	$code: LanguageCode; // e.g. en, en-GB
	$name: string; // e.g. English, Español
	$dir: LocalizeDirection;
}


export interface DefaultTranslation extends Translation {
	[key: string]: string | Fn<any, string>;
}


/** Registers one or more translations */
export const registerTranslation = (...translation: Translation[]) => {
	translation.map(t => {
		const code = t.$code.toLowerCase();

		if (localizeData.translations.has(code)) {
			// Merge translations that share the same language code
			localizeData.translations.set(code, { ...localizeData.translations.get(code), ...t });
		}
		else {
			localizeData.translations.set(code, t as DefaultTranslation);
		}

		// The first translation that's registered is the fallback
		if (!localizeData.fallback)
			localizeData.fallback = t as DefaultTranslation;
	});
};


/** Updates all localized elements that are currently connected */
export const update = async () => {
	localizeData.documentDirection = document.documentElement.dir || 'ltr';
	localizeData.documentLanguage = document.documentElement.lang || navigator.language;

	await Promise.all(localizeData.languageStore
		.get(localizeData.documentLanguage)?.map(langFn => langFn()) ?? []);

	type UnknownElement = (HTMLElement & {requestUpdate?: Fn});
	([ ...localizeData.connectedElements.keys() ] as UnknownElement[])
		.forEach((el) => el?.requestUpdate?.());
};


/** Augmented MutationObserver with the ability to check if it has had its `observe` method called */
class ImprovedMutationObserver extends MutationObserver {

	public hasObservers = false;

	public override observe(target: Node, options?: MutationObserverInit | undefined): void {
		this.hasObservers = true;
		super.observe(target, options);
	}

	public override disconnect(): void {
		this.hasObservers = false;
		super.disconnect();
	}

}


interface LocalizeData {
	connectedElements: Set<HTMLElement>;
	documentElementObserver: ImprovedMutationObserver;
	translations: Map<string, DefaultTranslation>;
	documentDirection: LocalizeDirection;
	documentLanguage: string;
	languageStore: Map<LanguageCode, DynamicImport[]>;
	fallback?: DefaultTranslation;
}


export const localizeData: LocalizeData = {
	connectedElements:       new Set<HTMLElement>(),
	translations:            new Map<string, DefaultTranslation>(),
	languageStore:           new Map<LanguageCode, DynamicImport[]>(),
	documentElementObserver: new ImprovedMutationObserver(update),
	documentDirection:       document.documentElement.dir || 'ltr',
	documentLanguage:        document.documentElement.lang || navigator.language,
	fallback:                undefined,
};
