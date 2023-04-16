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
	'./src/types/index.ts',
	'./src/localize/index.ts',
	'./src/animation/index.ts',
	'./src/utils/array/index.ts',
	'./src/utils/async/index.ts',
	'./src/utils/coms/index.ts',
	'./src/utils/dom/index.ts',
	'./src/utils/function/index.ts',
	'./src/utils/iterators/index.ts',
	'./src/utils/math/index.ts',
	'./src/utils/string/index.ts',
	'./src/utils/structs/index.ts',
	'./src/utils/timing/index.ts',
	'./src/utils/validation/index.ts',
]));
