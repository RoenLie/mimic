import { defineToolbox } from '@roenlie/package-toolbox/toolbox';


export default defineToolbox(async () => {
	const exclude = (path: string) => [
		'.demo',
		'.test',
		'.bench',
	].every(seg => !path.includes(seg));

	return {
		indexBuilder: {
			entrypoints: [
				{ path: './src/types/index.ts',            filters: [ exclude ] },
				{ path: './src/localize/index.ts',         filters: [ exclude ] },
				{ path: './src/animation/index.ts',        filters: [ exclude ] },
				{ path: './src/utils/array/index.ts',      filters: [ exclude ] },
				{ path: './src/utils/async/index.ts',      filters: [ exclude ] },
				{ path: './src/utils/coms/index.ts',       filters: [ exclude ] },
				{ path: './src/utils/dom/index.ts',        filters: [ exclude ] },
				{ path: './src/utils/function/index.ts',   filters: [ exclude ] },
				{ path: './src/utils/iterators/index.ts',  filters: [ exclude ] },
				{ path: './src/utils/math/index.ts',       filters: [ exclude ] },
				{ path: './src/utils/string/index.ts',     filters: [ exclude ] },
				{ path: './src/utils/structs/index.ts',    filters: [ exclude ] },
				{ path: './src/utils/timing/index.ts',     filters: [ exclude ] },
				{ path: './src/utils/validation/index.ts', filters: [ exclude ] },
			],
		},
	};
});
