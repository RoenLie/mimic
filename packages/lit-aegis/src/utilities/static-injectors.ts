import { type interfaces, METADATA_KEY } from 'inversify';
import type { DecoratorTarget } from 'inversify/lib/annotation/decorator_utils.js';
import * as ERROR_MSGS from 'inversify/lib/constants/error_msgs.js';
import { Metadata } from 'inversify/lib/planning/metadata.js';
import { getFirstArrayDuplicate } from 'inversify/lib/utils/js.js';


const createTaggedDecorator = (
	metadata: interfaces.MetadataOrMetadataArray,
	target: DecoratorTarget,
	targetKey?: string | symbol,
	index?: number,
) => {
	if (typeof index === 'number')
		_tagParameterOrProperty(METADATA_KEY.TAGGED, target, index.toString(), metadata);
	else if (targetKey)
		_tagParameterOrProperty(METADATA_KEY.TAGGED_PROP, target, targetKey, metadata);
};


const _tagParameterOrProperty = (
	metadataKey: string,
	annotationTarget: DecoratorTarget,
	key: string | symbol,
	metadata: interfaces.MetadataOrMetadataArray,
) => {
	const metadatas: interfaces.Metadata[] = _ensureNoMetadataKeyDuplicates(metadata);

	let paramsOrPropertiesMetadata: Record<string | symbol, interfaces.Metadata[] | undefined> = {};

	// read metadata if available
	if (Reflect.hasOwnMetadata(metadataKey, annotationTarget))
		paramsOrPropertiesMetadata = Reflect.getMetadata(metadataKey, annotationTarget) ?? {};

	let paramOrPropertyMetadata = paramsOrPropertiesMetadata[key];
	if (paramOrPropertyMetadata === undefined) {
		paramOrPropertyMetadata = [];
	}
	else {
		for (const m of paramOrPropertyMetadata) {
			if (metadatas.some(md => md.key === m.key))
				throw new Error(`${ ERROR_MSGS.DUPLICATED_METADATA } ${ m.key.toString() }`);
		}
	}

	// set metadata
	paramOrPropertyMetadata.push(...metadatas);
	paramsOrPropertiesMetadata[key] = paramOrPropertyMetadata;
	Reflect.defineMetadata(metadataKey, paramsOrPropertiesMetadata, annotationTarget);
};


const _ensureNoMetadataKeyDuplicates = (
	metadata: interfaces.MetadataOrMetadataArray,
): interfaces.Metadata[] => {
	const metadatas: interfaces.Metadata[] = Array.isArray(metadata)
		? metadata : [ metadata ];

	if (Array.isArray(metadata)) {
		const duplicate = getFirstArrayDuplicate(metadatas.map(md => md.key));

		if (duplicate !== undefined)
			throw new Error(`${ ERROR_MSGS.DUPLICATED_METADATA } ${ duplicate.toString() }`);
	}

	return metadatas;
};


export const injectProp = (
	target: DecoratorTarget,
	serviceIdentifier: interfaces.ServiceIdentifier,
	propName: string,
) => {
	const metadata = new Metadata(METADATA_KEY.INJECT_TAG, serviceIdentifier);
	createTaggedDecorator(metadata, target, propName);
};


export const injectParam = (
	target: DecoratorTarget,
	serviceIdentifier: interfaces.ServiceIdentifier,
	paramIndex: number,
) => {
	const metadata = new Metadata(METADATA_KEY.INJECT_TAG, serviceIdentifier);
	createTaggedDecorator(metadata, target, undefined, paramIndex);
};
