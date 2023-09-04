import { defineDocConfig } from '@roenlie/mirage-docs';
import { viteCopy } from '@roenlie/package-toolbox/vite-utils';
import type { UserConfig } from 'vite';


export default defineDocConfig({
	build: {
		outDir: './dist',
	},
}, {
	base:       '',
	root:       '/docs',
	source:     '/docs/pages',
	autoImport: {
		tagPrefixes:   [ 'mm' ],
		loadWhitelist: [ /\.ts/ ],
	},
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
}) as UserConfig;
