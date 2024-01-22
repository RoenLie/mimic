import { defineDocConfig } from '@roenlie/mirage-docs/server';
import { viteImportCssSheet } from 'vite-plugin-import-css-sheet';


export default defineDocConfig(
	() => {
		return {
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
		};
	},
	env => {
		return {
			resolve: {
				conditions: env.mode === 'development' ? [ 'mimic-workspace' ] : [],
			},
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
		};
	},
);
