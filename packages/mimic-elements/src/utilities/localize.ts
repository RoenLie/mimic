import { type DynamicPromise, isPromise, type ITrackedPromise, type Promised, sleep, TrackedPromise } from '@roenlie/mimic-core/async';
import { lazyMap } from '@roenlie/mimic-core/structs';
import type { stringliteral } from '@roenlie/mimic-core/types';
import type { ReactiveController, ReactiveControllerHost } from 'lit';
import { until } from 'lit/directives/until.js';


export class LocalizeController implements ReactiveController {

	protected host: ReactiveControllerHost & Element;

	constructor(options: { host: ReactiveControllerHost & Element }) {
		const { host } = options;
		(this.host = host).addController(this);
	}

	public hostConnected() {
	}

	public hostDisconnected() {
	}


	public term(text: string) {
		return until();
	}

}


declare global {
	interface WindowEventMap {
		'request-term': RequestTermEvent;
	}
}

class RequestTermEvent extends CustomEvent<{
	term: string | Promise<string>;
	lang: string,
	response: ITrackedPromise<string>
}> {}


class TermStore {

	#store = new Map<string, Map<string, string>>();

	public setTerm(term: string, lang: string, text: string) {
		const terms = lazyMap(this.#store, term, () => new Map());
		terms.set(lang, text);
	}

	public getTerm(term: string, lang: string) {
		return this.#store.get(term)?.get(lang);
	}

}


export const termStore = new TermStore();
termStore.setTerm('hallo', 'en', 'hello there traveler');


const requestEventName = 'request-term';
globalThis.addEventListener(requestEventName, (ev: RequestTermEvent) => {
	const { term, lang, response } = ev.detail;

	if (isPromise(term)) {
		term.then(term => {
			response.resolve(termStore.getTerm(term, lang) ?? term);
		});
	}
	else {
		response.resolve(termStore.getTerm(term, lang) ?? term);
	}
});


const dispatchTermRequest = (term: Promised<string>) => {
	const ev = new RequestTermEvent(requestEventName, {
		detail: {
			term,
			lang:     'en',
			response: new TrackedPromise<string>(() => {}),
		},
		bubbles:    false,
		cancelable: false,
		composed:   false,
	});

	globalThis.dispatchEvent(ev);

	return ev.detail.response;
};


export const term = (
	text: DynamicPromise<string>,
	placeholder: string = 'loading',
) => until(dispatchTermRequest(typeof text === 'function' ? text() : text), placeholder);
