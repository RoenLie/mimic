import { createPromiseResolver, resolveDynamicPromise } from '@roenlie/mimic-core/async';
import { injectable } from 'inversify';

import { $InjectParams, $InjectProps } from './constants.js';
import { container, isModuleLoaded, loadedModuleWeakSet } from './container.js';
import { ContainerModule } from './ContainerModule.js';
import { ElementMetadata } from './types.js';


export const injectableElement = (
	tagName: string,
	options?: {
		modules?: (ContainerModule | (() => ContainerModule | Promise<ContainerModule>))[];
	},
) => {
	return (target: CustomElementConstructor): any => {
		// if there are no modules to register, just define the component and immediatly return.
		if (!options?.modules) {
			customElements.define(tagName, target);

			return target;
		}

		// if there are modules to load.
		// loop through the registrations and load them if not already loaded.
		// defer defining the custom element untill all modules are resolved.
		const loading: any[] = [];

		const verifyAndAddModule = (module: ContainerModule) => {
			if (isModuleLoaded(module))
				return;

			loadedModuleWeakSet.add(module);
			container.load(module);
		};

		options.modules.forEach(module => {
			if (module instanceof ContainerModule)
				return verifyAndAddModule(module);

			const [ promise, resolve ] = createPromiseResolver();
			loading.push(promise);

			resolveDynamicPromise(module).then(module => {
				verifyAndAddModule(module);
				resolve(true);
			});
		});

		Promise.all(loading).then(() => customElements.define(tagName, target));

		return target;
	};
};


export const injectProp = (identifier: string | symbol, options?: {async?: boolean}) => {
	return (
		target: object,
		property: string,
	) => {
		let metadata: Map<string | symbol, ElementMetadata> = Reflect
			.getMetadata($InjectProps, target);

		if (!metadata) {
			metadata = new Map();
			Reflect.defineMetadata($InjectProps, metadata, target);
		}

		metadata.set(property, {
			identifier,
			async: options?.async ?? false,
		});
	};
};


export const injectParam = (identifier: string | symbol, options?: {async?: boolean}) => {
	return (
		target: object,
		property: undefined,
		parameterIndex: number,
	) => {
		let metadata: Map<number, ElementMetadata> = Reflect
			.getMetadata($InjectParams, target);

		if (!metadata) {
			metadata = new Map();
			Reflect.defineMetadata($InjectParams, metadata, target);
		}

		metadata.set(parameterIndex, {
			identifier,
			async: options?.async ?? false,
		});
	};
};


export const inject = (identifier: string | symbol, options?: {async?: boolean}) => {
	return (
		target: object,
		property: string | undefined,
		parameterIndex?: number,
	) => {
		if (typeof property === 'string') {
			let metadata: Map<string | symbol, ElementMetadata> = Reflect
				.getMetadata($InjectProps, target);

			if (!metadata) {
				metadata = new Map();
				Reflect.defineMetadata($InjectProps, metadata, target);
			}

			metadata.set(property, {
				identifier,
				async: options?.async ?? false,
			});
		}
		else if (typeof parameterIndex === 'number') {
			let metadata: Map<number, ElementMetadata> = Reflect
				.getMetadata($InjectParams, target);

			if (!metadata) {
				metadata = new Map();
				Reflect.defineMetadata($InjectParams, metadata, target);
			}

			metadata.set(parameterIndex, {
				identifier,
				async: options?.async ?? false,
			});
		}
	};
};


export { injectable };
