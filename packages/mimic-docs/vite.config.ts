import { defineDocConfig } from '@roenlie/mirage-docs';
import { UserConfig } from 'vite';


export default defineDocConfig({
	base:  '/mimic-docs',
	build: {
		outDir: './dist',
	},
	plugins: [],
}, {
	cacheDir:   './.cache',
	entryDir:   './src',
	autoImport: {
		tagPrefixes:   [ 'mimic' ],
		loadWhitelist: [ /\.ts/ ],
	},
});
