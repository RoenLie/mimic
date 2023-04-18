import { exec } from 'child_process';


const execPromise = (cmd: string) => {
	return new Promise((resolve, reject) => {
		const proc = exec(cmd);
		proc.stdout?.pipe(process.stdout);
		proc.on('error', () => reject(false));
		proc.on('exit', () => resolve(true));
	});
};


const buildOrder: string[][] = [
	[ '@roenlie/mimic-core' ],
	[ '@roenlie/mimic-lit', '@roenlie/mimic-router' ],
];


for await (const cmds of buildOrder)
	await Promise.all(cmds.map(cmd => execPromise(`pnpm --filter=${ cmd } run build`)));
