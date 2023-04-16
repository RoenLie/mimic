import { defineDocConfig } from '@roenlie/mirage-docs';
import { join, resolve } from 'path';
import { UserConfig } from 'vite';


export default defineDocConfig({
	base:      '/mimic',
	publicDir: 'docs/assets/',
	build:     {
		//emptyOutDir: false,
		outDir: './dist/preview',
	},
	plugins: [],
}, {
	cacheDir:   './docs',
	entryDir:   './src',
	autoImport: {
		tagPrefixes:   [ 'mimic' ],
		loadWhitelist: [ /\.ts/ ],
	},
}) as Promise<UserConfig>;
