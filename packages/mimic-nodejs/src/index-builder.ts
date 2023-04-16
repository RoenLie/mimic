import { parse as swcParse } from '@swc/core';
import fs from 'fs';
import { parse, resolve } from 'path';

import { genToArray } from './gen-to-array.js';
import { getFiles } from './get-files.js';
import { iterate } from './utilities/iterator.js';


/**
 * Builds a `targetFile` with exports from imports found in files accepted by the `pathMatchers`.
 */
export const indexBuilder = async (
	targetFile: string,
	pathMatchers: ((path: string) => boolean)[],
	options?: {
		/** @default `@internalexport` */
		exclusionJSDocTag?: string;
	},
) => {
	/* destructured options */
	const { exclusionJSDocTag = '@internalexport' } = options ?? {};

	/* Get the location of where this script is run from */
	const projectRoot = resolve();

	/* Resolve target */
	const pathTarget = resolve(projectRoot, targetFile);

	/* Get the target directory path, for use in creating relative paths */
	const dirTarget = parse(pathTarget).dir;

	/* Retrieve, map, filter and sort the file paths */
	const filePaths = (await genToArray(getFiles(dirTarget, /\.ts/)))
		.map(rawPath => ({ rawPath, path: rawPath.replaceAll('\\', '/') }))
		.filter(({ path }) => pathMatchers.some(fn => fn(path)));

	/* Extract exports from the files through ast parsing. */
	const exports = await Promise.all(filePaths.map(async ({ rawPath, path }) => {
		const content: string = await fs.promises.readFile(rawPath, { encoding: 'utf8' });
		const ast = await swcParse(
			content, { syntax: 'typescript', decorators: true, comments: true, target: 'es2022' },
		);

		const symbolTypes = [ 'ClassDeclaration',       'FunctionDeclaration',    'VariableDeclaration' ];
		const typeTypes   = [ 'TsTypeAliasDeclaration', 'TsInterfaceDeclaration', 'TsModuleDeclaration' ];

		const symbolExports = new Set<string>();
		const typeExports = new Set<string>();

		const exportTokenMap = new Map(tokenizeExports(content).map(exp => [ exp.name, exp.jsdoc ]));

		iterate(ast.body)
			.pipe(item => {
				if (item.type !== 'ExportDeclaration')
					return;

				if (symbolTypes.includes(item.declaration.type)) {
					return {
						type:        'symbol' as const,
						declaration: item.declaration,
					};
				}

				if (typeTypes.includes(item.declaration.type)) {
					return {
						type:        'type' as const,
						declaration: item.declaration,
					};
				}
			})
			.pipe(({ type, declaration }) => {
				if (type === 'symbol') {
					const newValue = { type: 'symbol' as const, value: '' };

					switch (declaration.type) {
					case 'ClassDeclaration':
					case 'FunctionDeclaration': {
						newValue.value = declaration.identifier.value;
						break;
					}
					case 'VariableDeclaration': {
						const varDeclarations = declaration.declarations.map(dec => {
							if (dec.id.type === 'Identifier')
								return dec.id.value;
						}).filter(Boolean).join(',');

						newValue.value = varDeclarations;
						break;
					}
					}

					if (!exportTokenMap.get(newValue.value)?.includes(exclusionJSDocTag))
						symbolExports.add(newValue.value);
				}

				if (type === 'type') {
					const newValue = { type: 'type' as const, value: '' };

					switch (declaration.type) {
					case 'TsTypeAliasDeclaration':
					case 'TsInterfaceDeclaration':
					case 'TsModuleDeclaration':
						newValue.value = declaration.id.value;
					}

					if (!exportTokenMap.get(newValue.value)?.includes(exclusionJSDocTag))
						typeExports.add(newValue.value);
				}
			})
			.toArray();

		return {
			path,
			symbols: [ ...symbolExports ],
			types:   [ ...typeExports ],
		};
	}));

	let lines = exports.reduce((prev, { path, symbols, types }) => {
		if (symbols.length) {
			let line = `export { ${ symbols.join(', ') } } from '${ path.replace('.ts', '.js') }';`;
			prev.push(line.replace(dirTarget.replaceAll('\\', '/'), '.'));
		}
		if (types.length) {
			let line = `export type { ${ types.join(', ') } } from '${ path.replace('.ts', '.js') }';`;
			prev.push(line.replace(dirTarget.replaceAll('\\', '/'), '.'));
		}

		return prev;
	}, [] as string[]);

	/* Check if there is an existing index file, and retrieve the contents */
	fs.mkdirSync(dirTarget, { recursive: true });

	const existingIndex = fs.existsSync(pathTarget)
		? await fs.promises.readFile(pathTarget, { encoding: 'utf8' })
		: '';

	const existingLines = existingIndex.split('\n').filter(l => l.startsWith('export'));

	/* compares two arrays and returns if they have the same entries, does not care about sort */
	const arrayEqualEntries = (a: string[], b: string[]) => {
		const sameNumberOfEntries = a.length === b.length;
		const cacheHasSameEntries = a.every(cache => b.includes(cache));

		return sameNumberOfEntries && cacheHasSameEntries;
	};

	/* only write the index file if it is different from what exists */
	const filesEqual = arrayEqualEntries(lines, existingLines);
	if (!filesEqual) {
		lines.sort((a, b) => {
			let aSort = a.length;
			let bSort = b.length;

			if (a.includes('export type'))
				aSort = aSort + 1000;
			if (b.includes('export type'))
				bSort = bSort + 1000;

			return bSort - aSort;
		});

		console.log('\n', 'create-index: Index updated');

		lines.unshift('/* auto generated */');
		lines.unshift('/* eslint-disable max-len */');
		lines.unshift('/* eslint-disable simple-import-sort/exports */');
		lines.push('');

		/* Write the new index file. */
		await fs.promises.writeFile(pathTarget, lines.join('\n'));
	}
};


interface ExportToken {
	name: string;
	jsdoc: string;
}


/** @internalexport */
export const tokenizeExports = (content: string): ExportToken[] => {
	const exportTokens: ExportToken[] = [];
	const exportRegex = /(?:\/\*\*(?:\s|\S)*?\*\/\s*)?export\s+(?:\w+\s+)?([\w*]+)?\s+(\w+)/g;

	const matches = [ ...content.matchAll(exportRegex) ];
	matches.forEach(([ comment, , name ]) => {
		const jsdocComment = comment.startsWith('/**')
			? comment.split('*/')[0] + '*/'
			: '';

		exportTokens.push({
			name:  name ?? '',
			jsdoc: jsdocComment,
		});
	});

	return exportTokens;
};
