import { componentAutoImporter, libConfig } from '@roenlie/package-toolbox/vite';
import { defineConfig } from 'vite';


export default defineConfig(async () => {
	return {
		...await libConfig(),
		esbuild: {
			minifyIdentifiers: false,
			tsconfigRaw:       {
				compilerOptions: {
					useDefineForClassFields: false,
					lib:                     [
						'ESNext',
						'DOM',
						'DOM.Iterable',
					],
				},
			},
		},
		plugins: [
			componentAutoImporter({
				directories:   [ { path: './src/components' } ],
				prefixes:      [ /mm-/ ],
				loadWhitelist: [ /./ ],
				loadBlacklist: [ /\.demo/ ],
			}),
		],
	};
});
