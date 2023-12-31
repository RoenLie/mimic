import { libConfig } from '@roenlie/package-toolbox/vite-utils';
import { defineConfig } from 'vite';


export default defineConfig(libConfig({
	build: {
		outDir: './dist/lib',
		minify: false,
	},
}));
