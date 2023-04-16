import { defineConfig } from 'vite';

import { libConfig } from './src/vite/vite-lib-config.js';


export default defineConfig(async () => {
	return { ...await libConfig() };
});
