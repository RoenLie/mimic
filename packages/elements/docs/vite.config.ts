import { defineDocConfig } from '@roenlie/mirage-docs';
import { viteCopy } from '@roenlie/package-toolbox/vite-utils';


export default defineDocConfig({
	build: {
		outDir: './dist',
	},
	plugins: [
		viteCopy({
			targets: [
				{
					from: './styles/*',
					to:   './docs/public/styles',
				},
			],
			hook:     'config',
			copyOnce: true,
		}),
	],
	publicDir: 'docs/public',
}, {
	cacheDir:   './docs/.cache',
	entryDir:   './src',
	autoImport: {
		tagPrefixes:   [ 'mm' ],
		loadWhitelist: [ /\.ts/ ],
	},
	siteConfig: {
		links: {
			scripts:    [ '/docs/bootstrap.ts' ],
			darkTheme:  '/styles/tokens-dark.css',
			lightTheme: '/styles/tokens-light.css',
			styles:     [
				'/styles/tokens-all.css',
				'/styles/tokens-all.css',
				'/styles/tokens-extra.css',
				'/styles/tokens-font.css',
			],
		},
		styles: {
			sidebar: `
			.greeting .title {
				width: min-content;
			}
			`,
		},
	},
});
