import { lazyMap } from '@roenlie/mimic-core/structs';
import { Container } from 'inversify';

import { $Container } from './constants.js';
import { ContainerModule } from './container-module.js';


const $defaultContainer = Symbol();


const containerRegistry = new Map<string | symbol, Container>();


const createContainer = () => {
	const container = new Container({ skipBaseClassChecks: true });
	container.bind($Container).toConstantValue(container);

	return container;
};


export const getContainer = (scope?: string | symbol) =>
	lazyMap(containerRegistry, scope ? scope : $defaultContainer, createContainer);


export const loadedModules = new WeakMap<Container, WeakSet<ContainerModule>>();
export const isModuleLoaded = (container: Container, module: ContainerModule) =>
	loadedModules.get(container)?.has(module);


export const getComponentModules = (tagname: string) => componentModuleIndex.get(tagname) ?? new Set();
export const componentModuleIndex = new Map<string, Set<ContainerModule>>();
