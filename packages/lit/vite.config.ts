//import { getExternalImportPaths } from '@roenlie/package-toolbox/filesystem/get-import-paths.js';
//import { globby } from 'globby';
import { libConfig } from '@roenlie/package-toolbox/vite-utils';
import { defineConfig, type UserConfig } from 'vite';


export default defineConfig(libConfig());

//export default defineConfig(async (): Promise<UserConfig> => {
//	/* find all external dependency paths used. */
//	const externalImportPaths = await getExternalImportPaths(
//		'./src',
//	);

//	return {
//		/** Do not include the public directory in the package output. */
//		publicDir: false,

//		esbuild: {
//			tsconfigRaw: {
//				compilerOptions: {
//					experimentalDecorators: true,
//				},
//			},
//		},

//		build: {
//			outDir: 'dist',

//			/** Don't empty the out dir, as we create our types first. */
//			emptyOutDir: false,

//			sourcemap: true,

//			/** Indicates that this is a library build.
//			 * Removes the requirement of a index.html file, instead starts at the entrypoint given in the options.
//			 */
//			lib: {
//				entry:   (await globby('./src/**/!(*.(test|demo|types)).ts')),
//				formats: [ 'es' ],
//			},

//			rollupOptions: {
//				external: externalImportPaths,
//				output:   {
//					preserveModules:     true,
//					preserveModulesRoot: 'src',
//				},
//			},

//			//rollupOptions: {

//			/** We add all files as entrypoints */
//			//input: (await globby('./src/**/!(*.(test|demo|types)).ts')),

//			/** By default, we externalize all dependencies.
//				*  There might be a few exceptions to this, with packages that make externalization difficult, or for other reasons. */
//			//external: externalImportPaths,

//			//output: {
//			//	/** By preseving modules, we retain the folder structure of the original source, thereby allowing
//			//	 *  generated d.ts files to be correctly picked up. */
//			//	preserveModules: true,

//			//	/** We remove src from any module paths to preserve the folder structure incase any virtual or node_modules
//			//	 *  files are included */
//			//	preserveModulesRoot: 'src',

//			//	/** We rename the file path to the file name and .js
//			//	 *  If we don't do this, in combination with preserve modules, we end up with double file paths. */
//			//	entryFileNames: (entry) => `${ entry.name }.js`,
//			//},
//			//},
//		},
//	};
//});
