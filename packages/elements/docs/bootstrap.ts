import { sleep } from '@roenlie/mimic-core/async';
import { LangBlockStore } from '@roenlie/mimic-localize/implement';
import { appendToLangMap, createLangMapFromJson } from '@roenlie/mimic-localize/utilities';

import codes from '../src/misc/language-en.json';


const langMap = createLangMapFromJson('en', {});
//const langMap = createLangMapFromJson('en', codes);
appendToLangMap(langMap, 'en', codes);

console.log(langMap);


class EsTermStore extends LangBlockStore {

	public async retrieveLangBlock(block: string, lang: string) {
		await sleep(500);

		return langMap.get(lang)?.get(block);
	}

}

const store = new EsTermStore();
console.log(store);
