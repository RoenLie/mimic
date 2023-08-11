import { createPromiseResolver, type Promised, type Promiser, resolveDynamicPromise } from '@roenlie/mimic-core/async';
import { lazyMap } from '@roenlie/mimic-core/structs';
import { inject as invInject, injectable as invInjectable } from 'inversify';

import { $ElementScope, $InjectParams, $InjectProps } from './constants.js';
import { componentModules, componentOptions } from './container.js';
import { ContainerModule } from './container-module.js';
import { AegisElement } from './element.js';
import { ensureCE } from './ensure-element.js';
import { type ElementMetadata, type Identifier, type ParamMetadata, type PropMetadata } from './types.js';


export type ModuleOption = Promised<ContainerModule> | Promiser<ContainerModule>;
export type DecoratorOptions = Omit<ElementMetadata, 'identifier'>;
export interface AegisElementOptions {
	/** The container this component will resolve dependencies from. */
	scope?: string;
	/** Container modules that are loaded on loading this component. */
	modules?: ModuleOption | ModuleOption[];
	/** If false, does not unload the modules on component disconnect. */
	unload?: boolean
}


export const injectableElement = (
	tagName: string,
	options?: AegisElementOptions,
) => {
	return (target: typeof AegisElement): any => {
		tagName = tagName.toLowerCase();
		target.tagName = tagName;

		componentOptions.set(tagName, options ?? {});

		Reflect.defineMetadata($ElementScope, options?.scope, target);

		// if there are no modules to register, just define the component and immediatly return.
		if (!options?.modules) {
			ensureCE(target);

			return target;
		}

		// if there are modules to load.
		// loop through the registrations resolve them then add them to this components set of modules.
		// the modules will then be syncronously loaded in its constructor.
		// defer defining the custom element untill all modules are resolved.
		const loading: any[] = [];

		const resolve = (module: ModuleOption) => {
			if (module instanceof ContainerModule)
				return registerModule(module);

			const [ promise, resolve ] = createPromiseResolver();
			loading.push(promise);

			resolveDynamicPromise(module)
				.then(module => (registerModule(module), resolve(true)));
		};

		const registerModule = (module: ContainerModule) => {
			const indexSet = lazyMap(componentModules, tagName, () => new Set());
			indexSet.add(module);
		};

		const modules = Array.isArray(options.modules) ? options.modules : [ options.modules ];
		modules.forEach(resolve);

		Promise.all(loading).then(() => ensureCE(target));

		return target;
	};
};


export const injectProp = (identifier: Identifier, options?: DecoratorOptions) => {
	return (
		target: AegisElement,
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
			scope: options?.scope,
		});
	};
};


export const injectParam = (identifier: Identifier, options?: DecoratorOptions) => {
	return (
		target: AegisElement,
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
			scope: options?.scope,
		});
	};
};


export const inject = (
	identifier: Identifier,
	/** Only relevant if used on an instance of InjectableElement */
	options?: DecoratorOptions,
) => {
	return (
		target: object,
		property: string | undefined,
		parameterIndex?: number,
	) => {
		if (!(target instanceof AegisElement))
			return invInject(identifier)(target, property, parameterIndex);

		if (typeof property === 'string')
			injectProp(identifier, options)(target, property);
		else if (typeof parameterIndex === 'number')
			injectParam(identifier, options)(target, property, parameterIndex);
	};
};


export const injectable = invInjectable;
