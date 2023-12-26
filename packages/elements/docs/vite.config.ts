import { defineDocConfig } from '@roenlie/mirage-docs/server';
import { viteCopy } from '@roenlie/package-toolbox/vite-utils';
import { viteImportCssSheet } from 'vite-plugin-import-css-sheet';


export default defineDocConfig({
	build: {
		outDir: './dist',
	},
	esbuild: {
		tsconfigRaw: {
			compilerOptions: {
				experimentalDecorators: true,
			},
		},
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
		viteImportCssSheet(),
	],
}, {
	base:       '',
	root:       '/docs',
	source:     '/src',
	autoImport: {
		tagPrefixes:   [ 'mm' ],
		loadWhitelist: [ /\.ts/ ],
	},
	siteConfig: {
		links: {
			scripts:    [ '/bootstrap.ts' ],
			darkTheme:  '/styles/tokens-dark.css',
			lightTheme: '/styles/tokens-light.css',
			styles:     [
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
		layout: {
			headingText: 'Mimic Elements',
			logoHeight:  'logo.svg',
		},
	},
});
