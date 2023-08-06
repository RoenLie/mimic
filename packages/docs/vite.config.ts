import { defineDocConfig } from '@roenlie/mirage-docs';


export default defineDocConfig({
	base:  '/mimic',
	build: {
		outDir: './dist',
	},
}, {
	cacheDir:   './.cache',
	entryDir:   './src',
	autoImport: {
		tagPrefixes:   [ 'mimic' ],
		loadWhitelist: [ /\.ts/ ],
	},
});
