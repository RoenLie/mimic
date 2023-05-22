import { join, resolve, sep } from 'node:path';

import { defineToolbox } from '@roenlie/package-toolbox/toolbox';
import { readdirSync } from 'fs';


export default defineToolbox(async () => {
	const exclude = (path: string) => [ '-demo', '.demo', '.test', '.bench' ]
		.every(seg => !path.includes(seg));

	const internalPath = '/src/components';
	const folderPath = join(resolve(), internalPath);
	const dirs = readdirSync(folderPath);

	const entrypoints = dirs.map(dir => {
		const path = '.' + join(folderPath, dir)
			.replace(resolve(), '')
			.replaceAll(sep, '/') + '/' + 'index.ts';

		const packagePath = './' + path.slice(1)
			.replace(internalPath, '')
			.split('/')
			.filter(Boolean)
			.at(0);

		return {
			path, packagePath,
		};
	});

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
