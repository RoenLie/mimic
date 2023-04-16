import { indexBuilder } from '../src/index-builder.js';


const exclude = [
	'.demo',
	'.test',
	'.bench',
];

await indexBuilder(
	'./src/index.ts',
	[ path => exclude.every(seg => !path.includes(seg)) ],
);
