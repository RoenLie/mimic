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
				{ path: './src/ripple/index.ts',      filters: [ exclude ] },
				{ path: './src/nav-rail/index.ts',    filters: [ exclude ] },
			],
		},
	};
});
