import { lazyMap, lazyWeakmap } from '@roenlie/mimic-core/structs';
import { Container } from 'inversify';

import { $Container } from './constants.js';
import { ContainerModule } from './container-module.js';
import { InjectableElementOptions } from './decorators.js';
import { ElementScope } from './types.js';


const $defaultContainer = Symbol();


const containerRegistry = new Map<ElementScope, Container>();


const createContainer = () => {
	const container = new Container({ skipBaseClassChecks: true });
	container.bind($Container).toConstantValue(container);

	return container;
};


export const getContainer = (scope?: ElementScope) =>
	lazyMap(containerRegistry, scope ? scope : $defaultContainer, createContainer);


export const loadedModules = new WeakMap<Container, WeakSet<ContainerModule>>();
export const isModuleLoaded = (container: Container, module: ContainerModule) =>
	loadedModules.get(container)?.has(module);


export const componentModules = new Map<string, Set<ContainerModule>>();
export const getComponentModules = (tagname: string) => componentModules.get(tagname.toLowerCase()) ?? new Set();
export const unloadComponentModules = (tagname: string, elementScope?: ElementScope) => {
	const container = getContainer(elementScope);
	const loadedSet = lazyWeakmap(loadedModules, container, () => new WeakSet());
	const modules = getComponentModules(tagname);
	modules.forEach(module => {
		container.unload(module);
		loadedSet.delete(module);
	});
};


export const componentOptions = new Map<string, InjectableElementOptions>();
export const getComponentOptions = (tagname: string) => componentOptions.get(tagname.toLowerCase()) ?? {};
