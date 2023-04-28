import { createPromiseResolver, Promised, Promiser, resolveDynamicPromise } from '@roenlie/mimic-core/async';
import { lazyWeakmap } from '@roenlie/mimic-core/structs';
import { inject as invInject, injectable as invInjectable } from 'inversify';

import { $ElementScope, $InjectParams, $InjectProps } from './constants.js';
import { getContainer, isModuleLoaded, loadedModules } from './container.js';
import { ContainerModule } from './container-module.js';
import { ensureCE } from './ensure-element.js';
import { InjectableElement } from './injectable-element.js';
import { Identifier, ParamMetadata, PropMetadata } from './types.js';


export type ModuleOption = Promised<ContainerModule> | Promiser<ContainerModule>;


export const injectableElement = (
	tagName: string,
	options?: {
		scope?: string;
		modules?: ModuleOption | ModuleOption[];
	},
) => {
	return (target: typeof InjectableElement): any => {
		target.tagName = tagName;

		Reflect.defineMetadata($ElementScope, options?.scope, target);

		// if there are no modules to register, just define the component and immediatly return.
		if (!options?.modules) {
			ensureCE(target);

			return target;
		}

		// if there are modules to load.
		// loop through the registrations and load them if not already loaded.
		// defer defining the custom element untill all modules are resolved.
		const loading: any[] = [];
		let container = getContainer(options?.scope);

		const verifyAndAddModule = (module: ContainerModule) => {
			if (isModuleLoaded(container, module))
				return;

			const set = lazyWeakmap(loadedModules, container, () => new WeakSet());
			set.add(module);
			container.load(module);
		};

		const resolve = (module: ModuleOption) => {
			if (module instanceof ContainerModule)
				return verifyAndAddModule(module);

			const [ promise, resolve ] = createPromiseResolver();
			loading.push(promise);

			resolveDynamicPromise(module).then(module => {
				verifyAndAddModule(module);
				resolve(true);
			});
		};

		if (Array.isArray(options.modules))
			options.modules.forEach(resolve);
		else
			resolve(options.modules);


		Promise.all(loading).then(() => ensureCE(target));

		return target;
	};
};


export const injectProp = (identifier: Identifier, options?: {async?: boolean}) => {
	return (
		target: InjectableElement,
		property: string,
	) => {
		let metadata: PropMetadata = Reflect.getMetadata($InjectProps, target);

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


export const injectParam = (identifier: Identifier, options?: {async?: boolean}) => {
	return (
		target: InjectableElement,
		property: undefined,
		parameterIndex: number,
	) => {
		let metadata: ParamMetadata = Reflect.getMetadata($InjectParams, target);

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


export const inject = (
	identifier: Identifier,
	/** Only relevant if used on an instance of InjectableElement */
	options?: { async?: boolean; },
) => {
	return (
		target: object,
		property: string | undefined,
		parameterIndex?: number,
	) => {
		if (!(target instanceof InjectableElement))
			return invInject(identifier)(target, property, parameterIndex);

		if (typeof property === 'string') {
			let metadata: PropMetadata = Reflect.getMetadata($InjectProps, target);

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
			let metadata: ParamMetadata = Reflect.getMetadata($InjectParams, target);

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

export const injectable = invInjectable;
