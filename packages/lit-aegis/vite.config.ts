import { libConfig } from '@roenlie/package-toolbox/vite-utils';
import { defineConfig } from 'vite';


export default defineConfig(async () => {
	const config = await libConfig({
		build: {
			outDir: './dist/lib',
			minify: false,
		},
	});

	const lib = config.build?.lib;
	if (lib) {
		if (Array.isArray(lib.entry))
			lib.entry = lib.entry.filter(entry => !entry.includes('_demo'));
	}

	return config;
});
