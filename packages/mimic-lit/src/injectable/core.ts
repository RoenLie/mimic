import { $ElementScope, $InjectParams } from './constants.js';
import { getContainer } from './container.js';
import { InjectableElement } from './InjectableElement.js';
import { ElementMetadata, ElementScope } from './types.js';


declare global {
	interface CustomElementRegistry {
		exists(tagname: string): boolean;
	}
}


const customDefineOrigin = customElements.define;
customElements.define = function(name, constructor, options) {
	if (!(constructor.prototype instanceof InjectableElement)) {
		customDefineOrigin.call(this, name, constructor, options);

		return;
	}

	type ParamMetadata = Map<number, ElementMetadata>

	const paramMetadata: ParamMetadata | undefined = Reflect
		.getMetadata($InjectParams, constructor.prototype.constructor);

	if (!paramMetadata?.size) {
		customDefineOrigin.call(this, name, constructor, options);

		return;
	}

	const ctor = class extends constructor {

		constructor() {
			const paramMetadata: ParamMetadata | undefined = Reflect
				.getMetadata($InjectParams, constructor.prototype.constructor);

			const elementScope: ElementScope | undefined = Reflect
				.getMetadata($ElementScope, constructor);

			const container = getContainer(elementScope);

			const args: any[] = [];
			paramMetadata?.forEach((value, key) => {
				args[key] = container.get(value.identifier);
			});

			super(...args);
		}

	};

	customDefineOrigin.call(this, name, ctor, options);
};


const customGetOrigin = customElements.get;
customElements.exists = function(tagname: string) {
	return !!customGetOrigin.call(this, tagname);
};
