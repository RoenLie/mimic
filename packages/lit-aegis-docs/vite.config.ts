import { defineDocConfig } from '@roenlie/mirage-docs';


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
	},
});
