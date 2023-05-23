import { createEntrypointsFromDirectories } from '@roenlie/package-toolbox/dist/filesystem/create-index-entries.js';
import { defineToolbox } from '@roenlie/package-toolbox/toolbox';


export default defineToolbox(async () => {
	const exclude = (path: string) => [ '-demo', '.demo', '.test', '.bench' ]
		.every(seg => !path.includes(seg));

	const entrypoints = createEntrypointsFromDirectories([ '/src/components' ]);

	return {
		indexBuilder: {
			entrypoints: [
				{ path: './src/index-fallback.ts', packageExport: false },
				...entrypoints,
			],
			defaultFilters:             [ exclude ],
			defaultPackageExport:       true,
			packageExportNameTransform: path => path
				.replace('./src', './dist')
				.replace('.ts', '.js'),
		},
	};
});
