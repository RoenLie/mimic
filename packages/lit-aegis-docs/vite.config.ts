import { defineDocConfig } from '@roenlie/mirage-docs/server';


export default defineDocConfig({
	esbuild: {
		tsconfigRaw: {
			compilerOptions: {
				experimentalDecorators: true,
			},
		},
	},
	build: {
		outDir: './dist',
	},
	plugins: [],
}, {
	base:       '',
	root:       '/',
	source:     '/pages',
	siteConfig: {
		links: {
			scripts: [ '/bootstrap.ts' ],
		},
		styles: {
			sidebar: `
			.greeting .title {
				width: min-content;
			}
			`,

		},
		layout: {
			headingText: 'Lit Aegis',
			logoHeight:  '60px',
			logoSrc:     'lit_aegis_logo.png',
		},
	},
});
