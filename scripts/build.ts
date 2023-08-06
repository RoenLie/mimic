import { exec } from 'child_process';

import { packageBuildOrder } from './utilities/find-build-order.js';


const execPromise = (cmd: string) => {
	return new Promise((resolve, reject) => {
		const proc = exec(cmd);
		proc.stdout?.pipe(process.stdout);
		proc.on('error', () => reject(false));
		proc.on('exit', () => resolve(true));
	});
};


const buildOrder = await packageBuildOrder();


for await (const cmds of buildOrder)
	await Promise.all(cmds.map(cmd => execPromise(`pnpm --filter=${ cmd } run build`)));
