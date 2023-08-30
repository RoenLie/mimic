import { LitElement } from 'lit';


export const getCurrentRef = () => component.ref;


export function component(
	tagName: string,
	create: (cls: typeof LitElement) => (element: LitElement) => unknown,
) {
	class Component extends LitElement {

		constructor() {
			super();
			sideEffects.forEach(reg => reg(this));
		}

		protected override render(): unknown {
			return render(this);
		}

	}

	component.ref = Component;
	const render = create(Component);
	component.ref = undefined;

	const sideEffects = [ ...component.sideEffects ];
	component.sideEffects.clear();

	return {
		tagName,
		register() {
			if (!globalThis.customElements.get(tagName))
				globalThis.customElements.define(tagName, Component);
		},
	};
}

component.sideEffects = new Set<((element: LitElement) => void)>();
component.ref = undefined as typeof LitElement | undefined;
