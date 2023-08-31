import { LitElement } from 'lit';


type Interface<T> = {
	[P in keyof T]: T[P]
}


declare class IFabricComponent extends LitElement {

	public static readonly tagName: string;
	public static __sideEffects: ((element: LitElement) => void)[];
	public static __render: (element: LitElement) => unknown;

}


type FabricConstructor = Interface<typeof LitElement> & {
	prototype: LitElement;
	new(): LitElement & { constructor: typeof IFabricComponent; };
}


export type FabricComponent = InstanceType<FabricConstructor>;


export const getCurrentRef = () => component.ref;


export const component = (
	tagName: string,
	create: (cls: FabricConstructor) => (element: LitElement) => unknown,
	options?: {
		base?: typeof LitElement;
		mixins?: ((...args: any[]) => any)[];
	},
) => {
	const base = (options?.mixins ?? []).reduce(
		(acc, cur) => cur(acc),
		(options?.base ?? LitElement),
	) as unknown as FabricConstructor;

	return class extends base {

		public static readonly tagName = tagName;
		public static __sideEffects: ((element: LitElement) => void)[];
		public static __render: (element: LitElement) => unknown;
		public static register()  {
			if (!globalThis.customElements.get(tagName))
				globalThis.customElements.define(tagName, this);
		}

		static {
			component.ref = this;
			this.__render = create(this);
			component.ref = undefined;

			this.__sideEffects = [ ...component.sideEffects ];
			component.sideEffects.clear();
		}

		constructor() {
			super();
			this.constructor.__sideEffects.forEach(reg => reg(this));
		}

		protected override render(): unknown {
			return this.constructor.__render(this);
		}

	} as unknown as {
		register(): void;
		tagName: string;
	};
};

component.sideEffects = new Set<((element: LitElement) => void)>();
component.ref = undefined as FabricConstructor | undefined;
