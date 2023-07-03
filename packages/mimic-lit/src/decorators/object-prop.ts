import { deepEqual } from 'fast-equals';
import { PropertyDeclaration } from 'lit';
import { property } from 'lit/decorators.js';


export const objectProp = (options: PropertyDeclaration): ((protoOrDescriptor: object, name?: PropertyKey | undefined) => any) =>
	property({ type: Object, attribute: false, hasChanged: (v, o) => deepEqual(v, o), ...options });
