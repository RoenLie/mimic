import { useReflectMetadata } from '@roenlie/reflect-metadata';
import {
	inject as _inject,
	injectable as _injectable,
	multiInject as _multiInject,
	named as _named,
	tagged as _tagged,
	unmanaged as _unmanaged,
} from 'inversify';

useReflectMetadata();


export const inject = _inject;
export const injectable = _injectable;
export const multiInject = _multiInject;
export const named = _named;
export const tagged = _tagged;
export const unmanaged = _unmanaged;
