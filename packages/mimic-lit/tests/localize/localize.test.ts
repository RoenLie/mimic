import { strFormat } from '@roenlie/mimic-core/string';
import { expect, test } from 'vitest';

import { term, termStore } from '../../src/localize/localize.js';

test('Set and request a syncronous term', async () => {
	const [ promise, code ] = term('hello', str => strFormat(str, 'PICKLE', 'PUCKLE'));
	console.log(await promise);
});
