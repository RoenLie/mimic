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
		root: {
			layout: {
				headingText: 'Mimic Elements',
				logoSrc:     'logo.svg',
			},
			styleOverrides: {
				sidebar: `
				.greeting .title {
					width: min-content;
				}
				`,
			},
		},
		pages: {
			darkTheme:  '/styles/tokens-dark.css',
			lightTheme: '/styles/tokens-light.css',
			styles:     [
				{ src: '/styles/tokens-all.css' },
				{ src: '/styles/tokens-extra.css' },
				{ src: '/styles/tokens-font.css' },
			],
			scripts: [ { src: '/bootstrap.ts' } ],
		},
	},
});
