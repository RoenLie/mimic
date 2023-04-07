import { libConfig } from '@roenlie/mimic-nodejs';
import { defineConfig, UserConfig } from 'vite';


export default defineConfig(async () => {
	const config = await libConfig() as UserConfig;

	return {
		...config,
		build: {
			...config.build,
			outDir: './dist/lib',
		},
	};
});
