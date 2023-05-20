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
				{ path: './src/index-fallback.ts',     filters: [ exclude ] },
				{ path: './src/ripple/index.ts',       filters: [ exclude ] },
				{ path: './src/nav-rail/index.ts',     filters: [ exclude ] },
				{ path: './src/icon/index.ts',         filters: [ exclude ] },
				{ path: './src/progress-bar/index.ts', filters: [ exclude ] },
				{ path: './src/upload/index.ts',       filters: [ exclude ] },
				{ path: './src/button/index.ts',       filters: [ exclude ] },
				{ path: './src/alert/index.ts',        filters: [ exclude ] },
				{ path: './src/tooltip/index.ts',      filters: [ exclude ] },
				{ path: './src/drawer/index.ts',       filters: [ exclude ] },
				{ path: './src/text/index.ts',         filters: [ exclude ] },
				{ path: './src/spinner/index.ts',      filters: [ exclude ] },
				{ path: './src/tabs/index.ts',         filters: [ exclude ] },
			],
		},
	};
});
