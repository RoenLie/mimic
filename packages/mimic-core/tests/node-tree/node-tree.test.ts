import { describe, expect, it } from 'vitest';

import { augment } from '../../src/node-tree/node-tree.js';


describe('thing', () => {
	it('should', () => {
		const obj = {
			first: 1,
			last:  2,
		};

		const augmented = augment(obj);
		console.log(augmented);
	});
});
