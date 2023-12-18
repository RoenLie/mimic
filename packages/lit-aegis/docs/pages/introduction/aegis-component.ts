import { type interfaces, METADATA_KEY } from 'inversify';
import type { DecoratorTarget } from 'inversify/lib/annotation/decorator_utils.js';
import * as ERROR_MSGS from 'inversify/lib/constants/error_msgs.js';
import { Metadata } from 'inversify/lib/planning/metadata.js';
import { getFirstArrayDuplicate } from 'inversify/lib/utils/js.js';
import { html } from 'lit';

import { Adapter } from '../../../src/adapter/adapter.js';
import { query } from '../../../src/adapter/decorators/adapter-query.js';
import { state } from '../../../src/adapter/decorators/adapter-state.js';
import { ContainerModule } from '../../../src/container/container.js';
import { AegisComponent } from '../../../src/element/aegis-component.js';
import { customElement } from '../../../src/element/aegis-element.js';


function injectProp(target: DecoratorTarget, serviceIdentifier: any, propName: string) {
	const metadata = new Metadata(METADATA_KEY.INJECT_TAG, serviceIdentifier);
	createTaggedDecorator(metadata)(target, propName);
}


function injectParam(target: DecoratorTarget, serviceIdentifier: any, paramIndex: number) {
	const metadata = new Metadata(METADATA_KEY.INJECT_TAG, serviceIdentifier);

	createTaggedDecorator(metadata)(target, undefined, paramIndex);
}


function createTaggedDecorator(
	metadata: interfaces.MetadataOrMetadataArray,
) {
	return <T>(
		target: DecoratorTarget,
		targetKey?: string | symbol,
		indexOrPropertyDescriptor?: number | TypedPropertyDescriptor<T>,
	) => {
		if (typeof indexOrPropertyDescriptor === 'number')
			tagParameter(target, indexOrPropertyDescriptor, metadata);
		else
			tagProperty(target, targetKey as string | symbol, metadata);
	};
}


function tagParameter(
	annotationTarget: DecoratorTarget,
	parameterIndex: number,
	metadata: interfaces.MetadataOrMetadataArray,
) {
	_tagParameterOrProperty(METADATA_KEY.TAGGED, annotationTarget, parameterIndex.toString(), metadata);
}


function tagProperty(
	annotationTarget: DecoratorTarget,
	propertyName: string | symbol,
	metadata: interfaces.MetadataOrMetadataArray,
) {
	_tagParameterOrProperty(METADATA_KEY.TAGGED_PROP, annotationTarget, propertyName, metadata);
}


function _tagParameterOrProperty(
	metadataKey: string,
	annotationTarget: DecoratorTarget,
	key: string | symbol,
	metadata: interfaces.MetadataOrMetadataArray,
) {
	const metadatas: interfaces.Metadata[] = _ensureNoMetadataKeyDuplicates(metadata);

	let paramsOrPropertiesMetadata: Record<string | symbol, interfaces.Metadata[] | undefined> = {};

	// read metadata if available
	if (Reflect.hasOwnMetadata(metadataKey, annotationTarget))
		paramsOrPropertiesMetadata = Reflect.getMetadata(metadataKey, annotationTarget) ?? {};

	let paramOrPropertyMetadata: interfaces.Metadata[] | undefined = paramsOrPropertiesMetadata[key as string];
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
}


function _ensureNoMetadataKeyDuplicates(metadata: interfaces.MetadataOrMetadataArray): interfaces.Metadata[] {
	let metadatas: interfaces.Metadata[] = [];
	if (Array.isArray(metadata)) {
		metadatas = metadata;
		const duplicate = getFirstArrayDuplicate(metadatas.map(md => md.key));
		if (duplicate !== undefined)
			throw new Error(`${ ERROR_MSGS.DUPLICATED_METADATA } ${ duplicate.toString() }`);
	}
	else {
		metadatas = [ metadata ];
	}

	return metadatas;
}


export class AegisTestAdapter extends Adapter {

	static {
		injectProp(this, 'test-value', 'testValue');
	}

	protected testValue: string;

	//@inject('test-value') protected testValue: string;

	@state() protected stateValue = 0;
	@query('div') protected divEl: HTMLElement;

	public override connectedCallback(): void {
		console.log(this.testValue);
	}

	public override afterConnectedCallback(): void {
		this.stateValue++;
	}

	public override render(): unknown {
		return html`
		Hello from aegis adapter.
		${ this.testValue }

		<div>${ this.stateValue }</div>
		`;
	}

}


@customElement('aegis-test-component')
export class AegisTestComponent extends AegisComponent {

	constructor() {
		super(AegisTestAdapter, containerModule);
	}

}


const containerModule = new ContainerModule(({ bind }) => {
	bind('test-value').toConstantValue('Hello I am a constant value');
});
