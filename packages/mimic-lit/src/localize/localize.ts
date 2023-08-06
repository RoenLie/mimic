import { until } from 'lit/directives/until.js';


type Dynamic<T> = T | Promise<T> | (() => Promise<T>) | (() => T);


export abstract class TermStore {

	protected static loadRef: (lang: string, terms: [term: string, text: string][]) => void;
	protected static requestRef: (term: Dynamic<string>, formatter?: (text: string) => string) => Promise<string>;
	protected static toggleRef: (callback: Function, state: boolean) => void;

	public static loadTerms(lang: string, terms: [term: string, text: string][]) {
		return TermStore.loadRef(lang, terms);
	}

	public static requestTerm(term: Dynamic<string>, formatter?: (text: string) => string) {
		return TermStore.requestRef(term, formatter);
	}

	public static toggleListener(callback: Function, state: boolean) {
		return TermStore.toggleRef(callback, state);
	}

	protected store = new Map<string, Map<string, string>>();
	protected listeners = new Set<Function>();
	protected langChangeObs = new MutationObserver(() => this.onLanguageChange());

	constructor() {
		if (!TermStore.requestRef)
			TermStore.requestRef = (term, formatter) => this.requestTerm(term, formatter);
		if (!TermStore.toggleRef)
			TermStore.toggleRef = (callback, state) => this.toggleListener(callback, state);
		if (!TermStore.loadRef)
			TermStore.loadRef = (lang, terms) => this.setTerms(lang, terms);

		this.listenForLanguageChange();
	}

	protected async requestTerm(term: Dynamic<string>, formatter?: (text: string) => string) {
		const lang = this.detectLanguage();

		let resolvedTerm = typeof term === 'function' ? term() : term;
		resolvedTerm = resolvedTerm instanceof Promise ? await resolvedTerm : resolvedTerm;

		if (!this.hasTerm(resolvedTerm, lang))
			await this.onTermDoesNotExist(resolvedTerm, lang);

		let text = this.getTerm(resolvedTerm, lang) ?? resolvedTerm;

		if (formatter)
			text = formatter(text);

		return text;
	}

	protected toggleListener(callback: Function, state: boolean) {
		if (state)
			this.listeners.add(callback);
		else
			this.listeners.delete(callback);
	}

	protected onLanguageChange() {
		for (const listener of this.listeners)
			listener();
	}

	//  TODO: Make this into a callback function or something that gets registered, so that there is no inherit connection to window.
	protected listenForLanguageChange() {
		this.langChangeObs.disconnect();
		this.langChangeObs.observe(
			document.documentElement,
			{ attributes: true, attributeFilter: [ 'lang' ] },
		);
	}

	public setTerm(lang: string, term: string, text: string) {
		const terms = this.store.get(term) ?? (() => {
			const map = new Map<string, string>();
			this.store.set(term, map);

			return map;
		})();

		terms.set(lang, text);
	}

	public setTerms(lang: string, terms: [term: string, text: string][]) {
		for (const [ term, text ] of terms)
			this.setTerm(lang, term, text);
	}

	public getTerm(term: string, lang: string) {
		return this.store.get(term)?.get(lang);
	}

	public hasTerm(term: string, lang: string) {
		return this.store.get(term)?.has(lang);
	}

	public detectLanguage() {
		return document.documentElement.getAttribute('lang') ?? 'en';
	}

	protected abstract onTermDoesNotExist(requestedTerm: string, lang: string): Promise<void> | void

}


/** Sends a request to the term store for a translated term.
 * Returns a [promise, code] where the promise resolves when the term store has successfully
 * retrieved the translation.
 */
export const term = (text: Dynamic<string>, formatter?: (text: string) => string) => {
	const resolvedText = typeof text === 'function' ? text() : text;
	const request = TermStore.requestTerm(resolvedText, formatter);

	return [ request, resolvedText, 'loading...' ] as const;
};


/** Uses a `until` directive to render the language code until the term is resolved from the term store. */
export const tTerm = (...args: Parameters<typeof term>) => until(...term(...args));


/** Register a callback function that is run upon detecting a language change in the browser. */
export const onLanguageChange = (callback: Function, state: boolean) => {
	TermStore.toggleListener(callback, state);
};

/** Loads terms for a spesified language into the term store. */
export const loadTerms = (lang: string, terms: [term: string, text: string][]) => {
	TermStore.loadTerms(lang, terms);
};
