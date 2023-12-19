import { html } from 'lit';

import { Adapter } from '../../../src/adapter/adapter.js';
import { query } from '../../../src/adapter/decorators/adapter-query.js';
import { state } from '../../../src/adapter/decorators/adapter-state.js';
import { ContainerModule } from '../../../src/container/container.js';
import { AegisComponent } from '../../../src/element/aegis-component.js';
import { customElement } from '../../../src/element/aegis-element.js';
import { injectParam, injectProp  } from '../../../src/utilities/static-injectors.js';


export class AegisTestAdapter extends Adapter {

	@state() protected stateValue = 0;
	@query('div') protected divEl: HTMLElement;
	protected testValue: string;

	static {
		injectProp(this, 'test-value', 'testValue');
		injectParam(this, 'test-value', 0);
	}

	//constructor(protected testVal1: string) {
	//	super();

	//	console.log({ testVal1 });
	//}

	public override connectedCallback(): void {
		//console.log(this.testValue);
		//console.log(this.testVal1);
	}

	public override afterConnectedCallback(): void {
		this.stateValue++;
	}

	public override render(): unknown {
		return html`
		Hello from aegis adapter.
		${ this.testValue }

		<div>${ this.stateValue }</div>
		`;
	}

}


@customElement('aegis-test-component')
export class AegisTestComponent extends AegisComponent {

	constructor() {
		super(AegisTestAdapter, containerModule);
	}

}


const containerModule = new ContainerModule(({ bind }) => {
	bind('test-value').toConstantValue('Hello I am a constant value');
});
