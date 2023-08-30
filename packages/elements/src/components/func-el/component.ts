import { LitElement } from 'lit';


export function wrapper<T extends(...args: any[]) => any>(
	this: { cmp: typeof LitElement; },
	func: T) {
	console.log('shit wrapped');

	return func.bind(this, this.cmp)();
}


export function component<TProps extends Record<string, any>>(
	tagName: string,
	create: (cls: typeof LitElement) =>
		(props: TProps, element: LitElement) => unknown,
) {
	class Component extends LitElement {


		constructor() {
			super();
			sideEffects.forEach(reg => reg.call(this));
		}

		protected override render() {
			return template(this as any, this as any) as any;
		}

	}

	const template: (props: TProps, element: LitElement) => unknown = wrapper.bind({ cmp: Component }, create)();
	const sideEffects = [ ...component.sideEffects ];
	component.sideEffects.clear();

	return {
		register() {
			globalThis.customElements.define(tagName, Component);
		},
	};
}

component.sideEffects = new Set<Function>();
