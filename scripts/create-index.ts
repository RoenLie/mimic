import { indexBuilder } from '@roenlie/mimic-nodejs';


const exclude = [
	'.demo',
	'.test',
	'.bench',
];

await indexBuilder(
	'./src/index.ts',
	[ path => exclude.every(seg => !path.includes(seg)) ],
);
