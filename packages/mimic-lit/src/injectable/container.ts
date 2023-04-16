import { Container } from 'inversify';

import { $Container } from './constants.js';
import { ContainerModule } from './ContainerModule.js';


export const container = new Container({ skipBaseClassChecks: true });
container.bind($Container).toConstantValue(container);


export const loadedModuleWeakSet = new WeakSet<ContainerModule>();


export const isModuleLoaded = (module: ContainerModule) => loadedModuleWeakSet.has(module);
