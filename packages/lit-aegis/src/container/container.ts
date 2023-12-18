import '@abraham/reflection';

import type { Fn } from '@roenlie/mimic-core/types';
import { deepmerge } from 'deepmerge-ts';
import {
	Container as iContainer,
	id,
	inject as iInject,
	injectable as iInjectable,
	type interfaces,
} from 'inversify';


export const inject = iInject;
export const injectable = iInjectable;


type PureRecord<T> = T extends CallableFunction ? never : T;


export type OverrideFunction<T extends (...args: any[]) => any> = (base: T | undefined) => T


interface ExtendedBindingToSyntax<T> extends interfaces.BindingToSyntax<T> {
	toHook<C extends (...args: any[]) => void>(value: C): interfaces.BindingWhenOnSyntax<T>;
	toConfig<C extends object>(value: PureRecord<C>): interfaces.BindingWhenOnSyntax<T>;
	toOverride<C extends OverrideFunction<(...args: any[]) => any>>(value: C): interfaces.BindingWhenOnSyntax<T>;
}


interface ModuleOptions {
	bind: <T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>) => ExtendedBindingToSyntax<T>;
	bindOnce: <T = unknown>(serviceIdentifier: interfaces.ServiceIdentifier<T>) => interfaces.BindingToSyntax<T> | undefined;
	unbind: interfaces.Unbind;
	isBound: interfaces.IsBound;
	isCurrentBound: interfaces.IsBound;
	rebind: interfaces.Rebind;
	unbindAsync: interfaces.UnbindAsync;
	onActivation: interfaces.Container['onActivation'];
	onDeactivation: interfaces.Container['onDeactivation'];
}


export class ContainerModule implements interfaces.ContainerModule {

	public id: number;
	public registry: any; /** Not using inversify default registry func */
	public load: (methods: ModuleOptions) => void;

	constructor(registry: (options: ModuleOptions) => void) {
		this.id = id();
		this.load = registry;
	}

}


export class Container extends iContainer {

	protected moduleMethodsFactory?: ContainerModuleMethodsFactory;

	public override load(...modules: ContainerModule[]) {
		this.moduleMethodsFactory ??= new ContainerModuleMethodsFactory(this);

		for (const currentModule of modules) {
			const methods = this.moduleMethodsFactory.create(currentModule.id);
			currentModule.load(methods);
		}
	}

	public override bind<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>): ExtendedBindingToSyntax<T> {
		const bindingTo = super.bind(serviceIdentifier) as ExtendedBindingToSyntax<T>;

		bindingTo.toConfig = <C extends object>(value: PureRecord<C>) =>
			bindingTo.toConstantValue(value as unknown as T);

		bindingTo.toHook = <C extends (...args: any[]) => void>(value: C) =>
			bindingTo.toConstantValue(value as unknown as T);

		bindingTo.toOverride = <C extends OverrideFunction<(...args: any[]) => any>>(value: C) =>
			bindingTo.toConstantValue(value as unknown as T);

		return bindingTo;
	}

	/**
	 * Binds an identifier only once.
	 * Returns undefined when an identifier is already bound.
	 */
	public bindOnce<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
		if (this.isBound(serviceIdentifier))
			return undefined;

		return this.bind(serviceIdentifier);
	}

	/**
	 * Checks if an identical identifier is bound in the current container and unbinds it
	 * then binds the new value.
	 */
	public override rebind<T>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
		if (this.isCurrentBound(serviceIdentifier))
			this.unbind(serviceIdentifier);

		return this.bind(serviceIdentifier);
	}

	/**
	 * Resolves all objects bound to this identifier and performs a deepmerge.
	 * This returns an object overriden in the order of the current `LoadLocation`.
	 */
	public getConfig<T extends object>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
		const cfgs = this.getAll<T>(serviceIdentifier);

		return deepmerge(...cfgs) as T;
	}

	/**
	 * Resolves all functions bound to this identifier.
	 * Returns a new function that loops over these functions
	 * and calls each one with the same arguments.
	 */
	public getHook<T extends(...args: any[]) => void>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
		const functions = this.getAll(serviceIdentifier);

		return ((...args: any[]) => {
			for (const fn of functions)
				fn(...args);
		}) as T;
	}

	/**
	 * Resolves all functions bound to this identifier
	 * Returns a new function that mimics the super concept of a class method.
	 */
	public getOverride<T extends(...args: any[]) => void>(serviceIdentifier: interfaces.ServiceIdentifier<T>) {
		const overrides = this.getAll<(base: Fn | undefined, ...args: any[]) => Fn>(
			serviceIdentifier as any);

		return ((...args: any[]) => {
			let func: Fn | undefined = undefined;

			for (const override of overrides)
				func = override(func, ...args);

			return func?.(...args);
		}) as T;
	}

}


class ContainerModuleMethodsFactory {

	protected static setModuleId(
		bindingToSyntax: interfaces.BindingToSyntax<unknown>,
		moduleId: interfaces.ContainerModuleBase['id'],
	) {
		interface SyntaxBinding { _binding: { moduleId: interfaces.ContainerModuleBase['id'] } }
		(bindingToSyntax as unknown as SyntaxBinding)._binding.moduleId = moduleId;
	}

	constructor(protected container: Container) { }

	protected bindFunction<T>(moduleId: interfaces.ContainerModuleBase['id']) {
		return (serviceIdentifier: interfaces.ServiceIdentifier) => {
			const bindingToSyntax = this.container.bind(serviceIdentifier);
			ContainerModuleMethodsFactory.setModuleId(bindingToSyntax, moduleId);

			return bindingToSyntax as ExtendedBindingToSyntax<T>;
		};
	}

	protected bindOnceFunction<T>(moduleId: interfaces.ContainerModuleBase['id']) {
		return (serviceIdentifier: interfaces.ServiceIdentifier<T>) => {
			const bindingToSyntax = this.container.bindOnce(serviceIdentifier);
			if (bindingToSyntax)
				ContainerModuleMethodsFactory.setModuleId(bindingToSyntax, moduleId);

			return bindingToSyntax as interfaces.BindingToSyntax<T> | undefined;
		};
	}

	protected unbindFunction() {
		return (serviceIdentifier: interfaces.ServiceIdentifier) => {
			return this.container.unbind(serviceIdentifier);
		};
	}

	protected unbindAsyncFunction() {
		return (serviceIdentifier: interfaces.ServiceIdentifier) => {
			return this.container.unbindAsync(serviceIdentifier);
		};
	}

	protected isboundFunction() {
		return (serviceIdentifier: interfaces.ServiceIdentifier) => {
			return this.container.isBound(serviceIdentifier);
		};
	}

	protected isCurrentBoundFunction() {
		return (serviceIdentifier: interfaces.ServiceIdentifier) => {
			return this.container.isCurrentBound(serviceIdentifier);
		};
	}

	protected rebindFunction<T = unknown>(moduleId: interfaces.ContainerModuleBase['id']) {
		return (serviceIdentifier: interfaces.ServiceIdentifier) => {
			const bindingToSyntax = this.container.rebind(serviceIdentifier);
			ContainerModuleMethodsFactory.setModuleId(bindingToSyntax, moduleId);

			return bindingToSyntax as interfaces.BindingToSyntax<T>;
		};
	}

	protected onActivationFunction<T = unknown>(moduleId: interfaces.ContainerModuleBase['id']) {
		return (serviceIdentifier: interfaces.ServiceIdentifier<T>, onActivation: interfaces.BindingActivation<T>) => {
			//@ts-expect-error
			this.container._moduleActivationStore.addActivation(moduleId, serviceIdentifier, onActivation);
			this.container.onActivation<T>(serviceIdentifier, onActivation);
		};
	}

	protected onDeactivationFunction<T = unknown>(moduleId: interfaces.ContainerModuleBase['id']) {
		return (serviceIdentifier: interfaces.ServiceIdentifier<T>, onDeactivation: interfaces.BindingDeactivation<T>) => {
			//@ts-expect-error
			this.container._moduleActivationStore.addDeactivation(moduleId, serviceIdentifier, onDeactivation);
			this.container.onDeactivation(serviceIdentifier, onDeactivation);
		};
	}

	public create(mId: interfaces.ContainerModuleBase['id']): ModuleOptions {
		return {
			isBound:        this.isboundFunction(),
			isCurrentBound: this.isCurrentBoundFunction(),
			bind:           this.bindFunction(mId),
			bindOnce:       this.bindOnceFunction(mId),
			rebind:         this.rebindFunction(mId),
			unbind:         this.unbindFunction(),
			unbindAsync:    this.unbindAsyncFunction(),
			onActivation:   this.onActivationFunction(mId),
			onDeactivation: this.onDeactivationFunction(mId),
		};
	}

}
