import { globby } from 'globby';
import { resolve } from 'path';
import { UserConfigExport } from 'vite';

import { getExternalImportPaths } from '../get-import-paths.js';


export const libConfig: () => Promise<UserConfigExport> = async () => {
	/* find all external dependency paths used. */
	const externalImportPaths = await getExternalImportPaths('./src');

	return {
		/** Do not include the public directory in the package output. */
		publicDir: false,

		build: {
			outDir: 'dist',

			/** Don't empty the out dir, as we create our types first. */
			emptyOutDir: false,

			/** Indicates that this is a library build.
			 * Removes the requirement of a index.html file, instead starts at the entrypoint given in the options.
			 */
			lib: {
				entry:   resolve('./src/index.ts'),
				formats: [ 'es' ],
			},

			rollupOptions: {
				/** We add all files as entrypoints */
				input: (await globby('./src/**/!(*.(test|demo|types)).ts')),

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
};
