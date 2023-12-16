import { defineToolbox } from '@roenlie/package-toolbox/toolbox';


export default defineToolbox(async () => {
	return {
		exportsBuilder: {
			entries: [
				{
					path: './*', default: './dist/*',
				},
			],
			options: {
				override: true,
			},
		},
	};
});
