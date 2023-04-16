import { $InjectParams } from './constants.js';
import { container } from './container.js';
import { InjectableElement } from './InjectableElement.js';
import { ElementMetadata } from './types.js';


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

	const ctor = class extends constructor {

		constructor() {
			const paramMetadata: Map<number, ElementMetadata> | undefined = Reflect
				.getMetadata($InjectParams, constructor.prototype.constructor);

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
