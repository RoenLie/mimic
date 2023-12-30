export type Decorator = ClassDecorator | MemberDecorator;
export type MemberDecorator = <T>(target: Target, propertyKey: PropertyKey, descriptor?: TypedPropertyDescriptor<T>) => TypedPropertyDescriptor<T> | void;
export type MetadataKey = string | symbol;
export type PropertyKey = string | symbol;
export type Target = object | Function;


const Metadata = new WeakMap();


const decorateProperty = (decorators: MemberDecorator[], target: Target, propertyKey: PropertyKey, descriptor?: PropertyDescriptor): PropertyDescriptor | undefined => {
	for (let i = decorators.length - 1; i >= 0; i--)
		descriptor = decorators[i]!(target, propertyKey, descriptor) || descriptor;

	return descriptor;
};


const decorateConstructor = (decorators: ClassDecorator[], target: Function): Function => {
	for (let i = decorators.length - 1; i >= 0; i--) {
		const decorated = decorators[i]!(target);
		if (decorated)
			target = decorated;
	}

	return target;
};


function decorate(decorators: ClassDecorator[], target: Function): Function;
function decorate(decorators: MemberDecorator[], target: object, propertyKey?: PropertyKey, attributes?: PropertyDescriptor): PropertyDescriptor | undefined;
function decorate(decorators: Decorator[], target: Target, propertyKey?: PropertyKey, attributes?: PropertyDescriptor): Function | PropertyDescriptor | undefined {
	if (!Array.isArray(decorators) || decorators.length === 0)
		throw new TypeError();

	if (propertyKey !== undefined)
		return decorateProperty(decorators as MemberDecorator[], target, propertyKey, attributes);

	if (typeof target === 'function')
		return decorateConstructor(decorators as ClassDecorator[], target);
}


const getMetadataMap = <T>(target: Target, propertyKey?: PropertyKey): Map<MetadataKey, T> | undefined => {
	return Metadata.get(target) && Metadata.get(target).get(propertyKey);
};


const ordinaryGetOwnMetadata = <T>(key: MetadataKey, target: Target, propertyKey?: PropertyKey): T | undefined => {
	if (target === undefined)
		throw new TypeError();

	const metadataMap = getMetadataMap<T>(target, propertyKey);

	return metadataMap && metadataMap.get(key);
};


const createMetadataMap = <T>(target: Target, propertyKey?: PropertyKey): Map<MetadataKey, T> => {
	const targetMetadata = Metadata.get(target) ?? new Map<PropertyKey | undefined, Map<MetadataKey, T>>();
	Metadata.set(target, targetMetadata);

	const metadataMap = targetMetadata.get(propertyKey) ?? new Map<MetadataKey, T>();
	targetMetadata.set(propertyKey, metadataMap);

	return metadataMap;
};


const ordinaryDefineOwnMetadata = <T>(key: MetadataKey, value: T, target: Target, propertyKey?: PropertyKey): void => {
	if (propertyKey && ![ 'string', 'symbol' ].includes(typeof propertyKey))
		throw new TypeError();

	const map = getMetadataMap<T>(target, propertyKey) ?? createMetadataMap<T>(target, propertyKey);
	map.set(key, value);
};


const ordinaryGetMetadata = <T>(key: MetadataKey, target: Target, propertyKey?: PropertyKey): T | undefined => {
	const ownMetadata = ordinaryGetOwnMetadata<T>(key, target, propertyKey);
	if (ownMetadata)
		return ownMetadata;

	const prototype = Object.getPrototypeOf(target);
	if (prototype)
		return ordinaryGetMetadata(key, prototype, propertyKey);
};


const metadata = <T>(key: MetadataKey, value: T) => {
	return (target: Target, propertyKey?: PropertyKey): void => {
		ordinaryDefineOwnMetadata<T>(key, value, target, propertyKey);
	};
};


const getMetadata = <T>(key: MetadataKey, target: Target, propertyKey?: PropertyKey): T | undefined => {
	return ordinaryGetMetadata<T>(key, target, propertyKey);
};


const getOwnMetadata = <T>(key: MetadataKey, target: Target, propertyKey?: PropertyKey): T | undefined => {
	return ordinaryGetOwnMetadata<T>(key, target, propertyKey);
};


const hasOwnMetadata = (key: MetadataKey, target: Target, propertyKey?: PropertyKey): boolean => {
	return !!ordinaryGetOwnMetadata(key, target, propertyKey);
};


const hasMetadata = (key: MetadataKey, target: Target, propertyKey?: PropertyKey): boolean => {
	return !!ordinaryGetMetadata(key, target, propertyKey);
};


const defineMetadata = <T>(key: MetadataKey, value: T, target: Target, propertyKey?: PropertyKey): void => {
	ordinaryDefineOwnMetadata(key, value, target, propertyKey);
};


const Reflection = {
	decorate,
	defineMetadata,
	getMetadata,
	getOwnMetadata,
	hasMetadata,
	hasOwnMetadata,
	metadata,
};


export const useReflectionShim = () => {
	const keys = Object.keys(Reflection);
	const existingProps = Object.getOwnPropertyNames(Reflect);
	if (existingProps.some(k => keys.includes(k)))
		return;

	Object.assign(Reflect, Reflection);
};


declare global {
	namespace Reflect {
		const decorate: typeof Reflection.decorate;
		const defineMetadata: typeof Reflection.defineMetadata;
		const getMetadata: typeof Reflection.getMetadata;
		const getOwnMetadata: typeof Reflection.getOwnMetadata;
		const hasOwnMetadata: typeof Reflection.hasOwnMetadata;
		const hasMetadata: typeof Reflection.hasMetadata;
		const metadata: typeof Reflection.metadata;
	}
}
