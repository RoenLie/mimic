import { libConfig } from '@roenlie/shared-nodejs';
import { defineConfig } from 'vite';


export default defineConfig(async () => {
	return { ...await libConfig() };
});
