import { defineToolbox } from '@roenlie/package-toolbox/toolbox';


export default defineToolbox(async () => {
	const exclude = (path: string) => [ '.demo', '.test', '.bench' ]
		.every(seg => !path.includes(seg));

	return {
		indexBuilder: {
			entrypoints:    [ { path: './src/index.ts', packageExport: false } ],
			defaultFilters: [ exclude ],
		},
		exportsBuilder: {
			entries: [
				{ path: './ts',   default: './src/index.ts'  },
				{ path: './ts/*', default: './src/*'         },
				{ path: './js',   default: './dist/index.js' },
				{ path: './js/*', default: './dist/*'        },
			],
			options: {
				override: true,
			},
		},
	};
});
