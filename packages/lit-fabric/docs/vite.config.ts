import { defineDocConfig } from '@roenlie/mirage-docs';
import { viteCopy } from '@roenlie/package-toolbox/vite-utils';
import type { UserConfig } from 'vite';


export default defineDocConfig({
	build: {
		outDir: './dist/preview',
	},
}, {
	base:       '',
	root:       '/docs',
	source:     '/docs/pages',
	siteConfig: {
		links: {
			scripts: [ '/bootstrap.ts' ],
		},
	},
}) as UserConfig;
