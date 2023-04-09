import { indexBuilder } from '@roenlie/mimic-nodejs';


const exclude = [
	'.demo',
	'.test',
	'.bench',
];

const buildMultiple = (targets: string[]) => {
	return targets.map(target => indexBuilder(
		target,
		[ path => exclude.every(seg => !path.includes(seg)) ],
	));
};

await Promise.all(buildMultiple([
	'./src/animation/index.ts',
	'./src/array/index.ts',
	'./src/async/index.ts',
	'./src/coms/index.ts',
	'./src/dom/index.ts',
	'./src/function/index.ts',
	'./src/iterators/index.ts',
	'./src/math/index.ts',
	'./src/string/index.ts',
	'./src/structs/index.ts',
	'./src/timing/index.ts',
	'./src/types/index.ts',
	'./src/validation/index.ts',
]));
