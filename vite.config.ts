import { globby } from 'globby';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import Inspect from 'vite-plugin-inspect';

import { getExternalImportPaths } from './build/get-import-paths.js';


export default defineConfig(async () => {
	/* find all external dependency paths used. */
	const externalImportPaths = await getExternalImportPaths('./src');

	return {
		plugins: [ (Inspect as any)() ],


		/** Do not include the public directory in the package output. */
		publicDir: false,

		/** This config is added due to not having a tsconfig.json in the root path next to vite.config.package
		 *  The useDefinedForClassFields is required to be false, for LIT to function correctly.
		 *  This might change in the future, whenever LIT updates to follow the proposed new decorator API. */
		esbuild: {
			minifyIdentifiers: false,
			tsconfigRaw:       {
				compilerOptions: {
					useDefineForClassFields: false,
				},
			},
		},

		build: {
			outDir: 'dist/lib/',

			/** Do not empty the build directory, as we have the preview build in the same folder. */
			emptyOutDir: true,

			/** Indicates that this is a library build.
			 *  Removes the requirement of a index.html file, instead starts at the entrypoint given in the options.*/
			lib: {
				entry:   resolve(__dirname, 'src/index.ts'),
				formats: [ 'es' ],
			},
			rollupOptions: {
				/** We add all files as entrypoints */
				input: (await globby('./src/**/!(*.(test|demo|editor|types)).ts')),

				/** By default, we externalize all dependencies.
				 *  There might be a few exceptions to this, with packages that make externalization difficult, or for other reasons. */
				external: externalImportPaths,

				output: {
					sourcemap: true,

					/** By preseving modules, we retain the folder structure of the original source, thereby allowing
					 *  generated d.ts files to be correctly picked up. */
					preserveModules: true,

					/** We remove src from any module paths to preserve the folder structure incase any virtual or node_modules
					 *  files are included */
					preserveModulesRoot: 'src',

					/** We rename the file path to the file name and .js
					 *  If we don't do this, in combination with preserve modules, we end up with double file paths. */
					entryFileNames: (entry) => `${ entry.name }.js`,
				},
			},
		},
	};
});
