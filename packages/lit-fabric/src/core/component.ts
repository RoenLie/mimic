import { LitElement } from 'lit';


type Interface<T> = {
	[P in keyof T]: T[P]
}


declare class IFabricComponent extends LitElement {

	public static readonly tagName: string;

}


type FabricConstructor = Interface<typeof LitElement> & {
	prototype: LitElement;
	new(): LitElement & { constructor: typeof IFabricComponent; };
}


export type FabricComponent = InstanceType<FabricConstructor>;


export const getCurrentRef = () => component.ref;


export const component = (
	tagName: string,
	create: (element: LitElement) => () => unknown,
	options?: {
		base?: typeof LitElement;
		mixins?: ((...args: any[]) => any)[];
	},
) => {
	let base = (options?.base ?? LitElement) as unknown as FabricConstructor;
	if (options?.mixins) {
		for (const mixin of options.mixins)
			base = mixin(base);
	}

	return class extends base {

		public static readonly tagName = tagName;
		public static register()  {
			if (!globalThis.customElements.get(tagName))
				globalThis.customElements.define(tagName, this);
		}

		constructor() {
			super();

			component.ref = this;
			this.render = create(this);
			component.ref = undefined;
		}

	} as unknown as {
		register(): void;
		tagName: string;
	};
};

component.ref = undefined as InstanceType<FabricConstructor> | undefined;
