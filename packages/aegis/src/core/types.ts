import { type Ctor } from '@roenlie/mimic-core/types';

export type PropertyName = string & Record<never, never>;
export interface ElementMetadata {
	async: boolean;
	scope?: string;
	identifier: Identifier;
}

export type ParamMetadata = Map<number, ElementMetadata>
export type PropMetadata = Map<string | symbol, ElementMetadata>;
export type ElementScope = string | symbol;
export type Identifier = string | symbol | Ctor<any>;
