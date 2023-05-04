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
				{ path: './src/index-fallback.ts',    filters: [ exclude ] },
				{ path: './src/directives/index.ts',  filters: [ exclude ] },
				{ path: './src/decorators/index.ts',  filters: [ exclude ] },
				{ path: './src/controllers/index.ts', filters: [ exclude ] },
				{ path: './src/injectable/index.ts',  filters: [ exclude ] },
				{ path: './src/state-store/index.ts', filters: [ exclude ] },
				{ path: './src/context/index.ts',     filters: [ exclude ] },
				{ path: './src/styles/index.ts',      filters: [ exclude ] },
			],
		},
	};
});
