import { defineDocConfig } from '@roenlie/mirage-docs';

import { copy } from '../vite-plugin-copy.js';


export default defineDocConfig({
	build: {
		outDir: './dist',
	},
	plugins: [
		copy({
			targets: [
				{
					src:  './styles',
					dest: './docs/assets',
				},
			],
			hook:     'config',
			copyOnce: true,
		}),
	],
	publicDir: 'docs/assets',
}, {
	cacheDir:   './docs/.cache',
	entryDir:   './src',
	autoImport: {
		tagPrefixes:   [ 'mm' ],
		loadWhitelist: [ /\.ts/ ],
	},
	siteConfig: {
		links: {
			darkTheme:  '/styles/tokens-dark.css',
			lightTheme: '/styles/tokens-light.css',
			styles:     [
				'/styles/tokens-all.css',
				'/styles/tokens-all.css',
				'/styles/tokens-extra.css',
				'/styles/tokens-typography.css',
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
