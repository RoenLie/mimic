import { createPromiseResolver, Promised, Promiser, resolveDynamicPromise } from '@roenlie/mimic-core/async';
import { lazyMap } from '@roenlie/mimic-core/structs';
import { inject as invInject, injectable as invInjectable } from 'inversify';

import { $ElementScope, $InjectParams, $InjectProps } from './constants.js';
import { componentModules, componentOptions, getComponentModules, getContainer, isModuleLoaded, loadedModules } from './container.js';
import { ContainerModule } from './container-module.js';
import { ensureCE } from './ensure-element.js';
import { InjectableElement } from './injectable-element.js';
import { Identifier, ParamMetadata, PropMetadata } from './types.js';


export type ModuleOption = Promised<ContainerModule> | Promiser<ContainerModule>;
export type InjectableElementOptions = {
	/** The container this component will resolve dependencies from. */
	scope?: string;
	/** Container modules that are loaded on loading this component. */
	modules?: ModuleOption | ModuleOption[];
	/** If false, does not unload the modules on component disconnect. */
	unload?: boolean
}


export const injectableElement = (
	tagName: string,
	options?: InjectableElementOptions,
) => {
	return (target: typeof InjectableElement): any => {
		target.tagName = tagName;

		componentOptions.set(tagName, options ?? {});

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

		const resolve = (module: ModuleOption) => {
			if (module instanceof ContainerModule)
				return registerModule(module);

			const [ promise, resolve ] = createPromiseResolver();
			loading.push(promise);

			resolveDynamicPromise(module).then(module => {
				registerModule(module), resolve(true);
			});
		};

		const registerModule = (module: ContainerModule) => {
			const indexSet = lazyMap(componentModules, target.tagName, () => new Set());
			indexSet.add(module);
		};

		const modules = Array.isArray(options.modules) ? options.modules : [ options.modules ];
		modules.forEach(resolve);

		Promise.all(loading).then(() => ensureCE(target));

		target.__unloadModules = async () => {
			if (!options.unload || !options.modules)
				return;

			const modules = getComponentModules(target.tagName);
			container.unload(...modules);
		};

		return target;
	};
};


export const injectProp = (identifier: Identifier, options?: { async?: boolean; }) => {
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


export const injectParam = (identifier: Identifier, options?: { async?: boolean; }) => {
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
