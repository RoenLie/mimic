import { deepEqual } from 'fast-equals';
import { property } from 'lit/decorators.js';


export const objectProp = (...options: Parameters<typeof property>): ((protoOrDescriptor: object, name?: PropertyKey | undefined) => any) =>
	property({ type: Object, attribute: false, hasChanged: (v, o) => deepEqual(v, o), ...options });
