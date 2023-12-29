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
		root: {
			layout: {
				headingText: 'Aegis',
				logoHeight:  '60px',
				logoSrc:     'logo.svg',
			},
		},
		pages: {
			scripts: [ { src: '/bootstrap.ts' } ],
		},
	},
});
