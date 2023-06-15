import { Ctor } from '@roenlie/mimic-core/types';

export type PropertyName = string & Record<never, never>;
export type ElementMetadata = {
	async: boolean;
	identifier: Identifier;
}

export type ParamMetadata = Map<number, ElementMetadata>
export type PropMetadata = Map<string | symbol, ElementMetadata>;
export type ElementScope = string | symbol;
export type Identifier = string | symbol | Ctor<any>;
