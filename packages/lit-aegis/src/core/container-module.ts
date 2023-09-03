import { id, type interfaces  } from 'inversify';


interface ModuleOptions {
	bind: interfaces.Bind;
	unbind: interfaces.Unbind;
	isBound: interfaces.IsBound;
	rebind: interfaces.Rebind;
	unbindAsync: interfaces.UnbindAsync;
	onActivation: interfaces.Container['onActivation'];
	onDeactivation: interfaces.Container['onDeactivation'];
	bindOnce: <T>(serviceIdentifier: interfaces.ServiceIdentifier<T>) => interfaces.BindingToSyntax<T> | undefined;
	rebindSafe: <T>(serviceIdentifier: interfaces.ServiceIdentifier<T>) => interfaces.BindingToSyntax<T> | undefined;
}


export class ContainerModule implements interfaces.ContainerModule {

	public id = id();
	public registry: interfaces.ContainerModuleCallBack;

	constructor(registry: (options: ModuleOptions) => void) {
		this.registry = (...args) => registry(this.#moduleArgs(args));
	}

	#moduleArgs(args: Parameters<interfaces.ContainerModuleCallBack>): any {
		const [ bind, unbind, isBound, rebind, unbindAsync, onActivation, onDeactivation ] = args;
		const bindOnce = <T>(serviceIdentifier: interfaces.ServiceIdentifier<T>) => {
			if (!isBound(serviceIdentifier))
				return bind(serviceIdentifier);
		};
		const rebindSafe = <T>(serviceIdentifier: interfaces.ServiceIdentifier<T>) => {
			if (isBound(serviceIdentifier)) {
				try {
					return rebind(serviceIdentifier);
				}
				catch (error) { /*  */ }
			}
		};

		return  {
			bind,
			unbind,
			isBound,
			rebind,
			unbindAsync,
			onActivation,
			onDeactivation,
			bindOnce,
			rebindSafe,
		} satisfies ModuleOptions;
	}

}
