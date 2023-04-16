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
	'./src/controllers/index.ts',
	'./src/decorators/index.ts',
	'./src/injectable/index.ts',
	'./src/state-store/index.ts',
]));
