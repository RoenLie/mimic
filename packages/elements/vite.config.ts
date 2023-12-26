import { componentAutoImporter, libConfig } from '@roenlie/package-toolbox/vite-utils';
import { defineConfig } from 'vite';
import { viteImportCssSheet } from 'vite-plugin-import-css-sheet';


export default defineConfig(libConfig({
	esbuild: {
		minifyIdentifiers: false,
	},
	plugins: [
		componentAutoImporter({
			directories:   [ { path: './src/components' } ],
			prefixes:      [ /mm-/ ],
			loadWhitelist: [ /./ ],
			loadBlacklist: [ /\.demo/ ],
		}),
		viteImportCssSheet(),
	],
}));
