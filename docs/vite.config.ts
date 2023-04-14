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
	//siteConfig: {
	//links: {
	//	//styles: [
	//	//	'https://fonts.googleapis.com/css?family=Roboto',
	//	//	//'/assets/tokens/css/variables-extra.css',
	//	//],
	//	//scripts: [ '/docs/bootstrap.ts' ],
	//	//darkTheme:  '/vendor/tokens/css/variables-dark.css',
	//	//lightTheme: '/vendor/tokens/css/variables-light.css',
	//},
	//},
	autoImport: {
		tagPrefixes:   [ 'mimic' ],
		loadWhitelist: [ /\.ts/ ],
	},
}) as Promise<UserConfig>;
