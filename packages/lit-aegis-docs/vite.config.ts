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
		},
		layout: {
			headingText: 'Aegis',
			logoHeight:  '60px',
			logoSrc:     'logo.svg',
		},
	},
});
