import { type DynamicPromise, isPromise, type ITrackedPromise, type Promised, sleep, TrackedPromise } from '@roenlie/mimic-core/async';
import { addBeholder, dispatchPhenom, Phenomenon } from '@roenlie/mimic-core/coms';
import { until } from 'lit/directives/until.js';

//export class LocalizeController implements ReactiveController {

//	protected host: ReactiveControllerHost & Element;

//	constructor(options: { host: ReactiveControllerHost & Element }) {
//		const { host } = options;
//		(this.host = host).addController(this);
//	}

//	public hostConnected() {
//	}

//	public hostDisconnected() {
//	}


//	public term(text: string) {
//		return until();
//	}

//}


declare global {
	interface PhenomBeholderMap {
		'request-term': Phenomenon<{term: string}>;
	}
}

type Detail = {
	term: string | Promise<string>;
	lang: string;
	response: ITrackedPromise<string>;
	formatter?: (text: string) => string;
}


class RequestTermPhenom extends Phenomenon<Detail> {}


class TermStore {

	#store = new Map<string, Map<string, string>>();

	public setTerm(term: string, lang: string, text: string) {
		const terms = this.#store.get(term) ?? (() => {
			const map = new Map<string, string>();
			this.#store.set(term, map);

			return map;
		})();

		terms.set(lang, text);
	}

	public getTerm(term: string, lang: string) {
		return this.#store.get(term)?.get(lang);
	}

	public hasTerm(term: string, lang: string) {
		return this.#store.get(term)?.has(lang);
	}

	public async loadTerms(terms: [code: string, text: string][], lang: string) {
		await sleep(1000);

		for (const [ code, text ] of terms)
			this.setTerm(code, lang, text);
	}

}

const requestPhenomName = 'request-term';

const createTermStore = () => {
	addBeholder(requestPhenomName, async (ev: RequestTermPhenom) => {
		const { term, lang, response, formatter } = ev.detail;

		const resolvedTerm = isPromise(term) ? await term : term;

		if (!termStore.hasTerm(resolvedTerm, lang))
			await termStore.loadTerms([ [ 'hello', 'I the {0} am a {1} {0}' ] ], lang);

		let text = termStore.getTerm(resolvedTerm, lang) ?? resolvedTerm;

		if (formatter)
			text = formatter(text);

		response.resolve(text);
	});

	return new TermStore();
};


export const termStore = createTermStore();


export const dispatchTermRequest = (term: Promised<string>, formatter?: (text: string) => string) => {
	const phenom = new RequestTermPhenom(requestPhenomName, {
		term,
		lang:     'en',
		response: new TrackedPromise<string>(() => {}),
		formatter,
	});

	dispatchPhenom(phenom);

	return phenom.detail.response;
};


export const term = (
	text: DynamicPromise<string>,
	formatter?: (text: string) => string,
) => {
	const resolvedText = typeof text === 'function' ? text() : text;
	const request = dispatchTermRequest(typeof text === 'function' ? text() : text, formatter);
	const placeholder = isPromise(resolvedText) ? 'loading...' : resolvedText;

	return [ request, placeholder ] as const;
};


export const tTerm = (...args: Parameters<typeof term>) => until(...term(...args));
