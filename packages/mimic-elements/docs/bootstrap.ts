import { sleep } from '@roenlie/mimic-core/async';
import { lazyMap } from '@roenlie/mimic-core/structs';
import { TermStore } from '@roenlie/mimic-lit/localize';

import codes from '../src/misc/language-en.json';


const languageMap = (() => {
	const codeMap = new Map<string, Map<string, string>>();

	type LangBlock = {
		[key: string]: LangBlock | string
	}

	const dig = (prefix: string, obj: LangBlock) => {
		const entries = Object.entries(obj);
		entries.forEach(([ key, value ]) => {
			if (typeof value === 'string') {
				const map = lazyMap(codeMap, prefix, lazyMap.createMap);
				map.set(key, value);
			}
			else {
				dig((prefix ? prefix + '.' : '') + key, value);
			}
		});
	};

	dig('', codes);

	return codeMap;
})();


class EsTermStore extends TermStore {

	public langBlockRequests = new Map<string, Promise<any>>();

	public async retrieveLangBlock(block: string, lang: string) {
		await sleep(500);

		return languageMap.get(block);
	}

	public override async onTermDoesNotExist(requestedTerm: string, lang: string) {
		const head = requestedTerm.split('.').slice(0, -1).join('.');

		const requestKey = lang + ':' + head;
		const existingRequest = this.langBlockRequests.get(requestKey);

		if (existingRequest) {
			await existingRequest;
		}
		else {
			const termBlock = this.retrieveLangBlock(head, lang);
			this.langBlockRequests.set(requestKey, termBlock);

			for (const [ code, text ] of await termBlock ?? new Map())
				this.setTerm(lang, head + '.' + code, text);

			this.langBlockRequests.delete(requestKey);
		}
	}

}

new EsTermStore();
