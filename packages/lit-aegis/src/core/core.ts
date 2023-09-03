import { lazyWeakmap } from '@roenlie/mimic-core/structs';

import { $ElementScope, $InjectParams } from './constants.js';
import { getComponentModules, getContainer, isModuleLoaded, loadedModules } from './container.js';
import { AegisElement } from './element.js';
import { type ElementMetadata, type ElementScope } from './types.js';


declare global {
	interface CustomElementRegistry {
		exists(tagname: string): boolean;
	}
}


let shimmed = false;


export const injectableShim = () => {
	if (shimmed)
		return;

	shimmed = true;

	const nativeDefine = customElements.define;
	customElements.define = function(name, constructor, options) {
		if (!(constructor.prototype instanceof AegisElement)) {
			nativeDefine.call(this, name, constructor, options);

			return;
		}

		type ParamMetadata = Map<number, ElementMetadata>

		const paramMetadata: ParamMetadata | undefined = Reflect
			.getMetadata($InjectParams, constructor.prototype.constructor);

		if (!paramMetadata?.size) {
			nativeDefine.call(this, name, constructor, options);

			return;
		}

		const ctor = class extends constructor {

			constructor() {
				const paramMetadata: ParamMetadata | undefined = Reflect
					.getMetadata($InjectParams, constructor.prototype.constructor);

				const elementScope: ElementScope | undefined = Reflect
					.getMetadata($ElementScope, constructor);

				const container = getContainer(elementScope);
				const modules = getComponentModules((constructor as typeof AegisElement).tagName);
				modules.forEach(module => {
					if (isModuleLoaded(container, module))
						return;

					const set = lazyWeakmap(loadedModules, container, () => new WeakSet());
					set.add(module);

					container.load(module);
				});

				const args: any[] = [];
				paramMetadata?.forEach((value, key) => {
					try {
						args[key] = container.get(value.identifier);
					}
					catch (error) {
						console.error('Unable to resolve:', value.identifier, 'in element:', this.tagName);
					}
				});

				super(...args);
			}

		};

		nativeDefine.call(this, name, ctor, options);
	};

	const nativeGet = customElements.get;
	customElements.exists = function(tagname: string) {
		return !!nativeGet.call(this, tagname);
	};
};
