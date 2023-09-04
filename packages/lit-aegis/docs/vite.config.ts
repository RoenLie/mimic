import { defineDocConfig } from '@roenlie/mirage-docs';
import { viteCopy } from '@roenlie/package-toolbox/vite-utils';
import type { UserConfig } from 'vite';


export default defineDocConfig({
	build: {
		outDir: './dist',
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
