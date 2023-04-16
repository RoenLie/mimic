#!/usr/bin/env node
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';

yargs(hideBin(process.argv))
	.command('increment-version', 'increment the package.json version', () => { /*  */ }, async () => {
		const { incrementPackageVersion } = await import('../dist/increment-package-version.js');
		await incrementPackageVersion();
	})
	.demandCommand(1)
	.parse();
