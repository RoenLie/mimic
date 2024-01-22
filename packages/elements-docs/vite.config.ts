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
	plugins: [ viteImportCssSheet() ],
}, {
	base:       '',
	root:       '/',
	source:     '/src',
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
			scripts: [ { src: '/src/bootstrap.ts' } ],
		},
	},
});
