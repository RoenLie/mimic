import { defineDocConfig } from '@roenlie/mirage-docs/server';
import { viteCopy } from '@roenlie/package-toolbox/vite-utils';
import { randomUUID } from 'crypto';
import { readFile } from 'fs/promises';
import type { Plugin } from 'vite';


export default defineDocConfig({
	build: {
		outDir: './dist',
	},
	esbuild: {
		tsconfigRaw: {
			compilerOptions: {
				experimentalDecorators: true,
			},
		},
	},
	plugins: [
		viteCopy({
			targets: [
				{
					from: './styles/*',
					to:   './docs/public/styles',
				},
			],
			hook:     'config',
			copyOnce: true,
		}),

		((): Plugin => {
			const convert = (s: string) => {
				const illegalChars = new Map();
				illegalChars.set('\\', '\\\\');
				illegalChars.set('`', '\\`');
				illegalChars.set('$', '\\$');

				if (!s)
					return '``';


				let res = '';
				for (let i = 0; i < s.length; i++) {
					const c = s.charAt(i);
					res += illegalChars.get(c) || c;
				}

				return `\`${ res }\``;
			};

			const virtualModules = new Map<string, string>();

			const cssImportAssertRegex = (str: string) =>
				new RegExp(str + `['"] *with|assert *{[(?:\r?\n) \t]*type: *'css'[(?:\r?\n) ]*};`);

			return {
				enforce: 'pre',
				name:    'vite-assert-css-imports',
				async resolveId(source, importer) {
					if (source.endsWith('.css')) {
						const resolvedId = await this.resolve(source, importer);

						if (importer) {
							importer = importer?.split('?')[0];

							if (resolvedId && [ '.ts', '.mts', '.js', '.mjs' ].some(str => importer?.endsWith(str))) {
								const importerContent = await readFile(importer!, { encoding: 'utf8' });
								const regxp = cssImportAssertRegex(source);

								if (regxp.test(importerContent)) {
									const modId = '\0virtual:' + randomUUID();
									virtualModules.set(modId, resolvedId.id);

									return modId;
								}
							}
						}
					}
				},
				async load(id) {
					if (virtualModules.has(id)) {
						const realId = virtualModules.get(id)!;

						try {
							const fileContent = await readFile(realId, { encoding: 'utf8' });
							this.addWatchFile(realId);

							return `
								let sheet;
								try {
									sheet = new CSSStyleSheet()
									sheet.replaceSync(${ convert(fileContent) });
								} catch(err) {
									console.error('Constructable Stylesheets are not supported in your environment.'
										+'Please consider a polyfill, e.g. https://www.npmjs.com/package/construct-style-sheets-polyfill')
								}

								export default sheet;
							`;
						}
						catch (err) {
							console.error('Unable to load asserted css file:' + realId);
						}
					}
				},
			};
		})(),
	],
}, {
	base:       '',
	root:       '/docs',
	source:     '/src',
	autoImport: {
		tagPrefixes:   [ 'mm' ],
		loadWhitelist: [ /\.ts/ ],
	},
	siteConfig: {
		links: {
			scripts:    [ '/bootstrap.ts' ],
			darkTheme:  '/styles/tokens-dark.css',
			lightTheme: '/styles/tokens-light.css',
			styles:     [
				'/styles/tokens-all.css',
				'/styles/tokens-extra.css',
				'/styles/tokens-font.css',
			],
		},
		styles: {
			sidebar: `
			.greeting .title {
				width: min-content;
			}
			`,
		},
		layout: {
			headingText: 'Mimic Elements',
			logoHeight:  'logo.svg',
		},
	},
});
