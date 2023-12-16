import { html } from 'lit';

import { Adapter } from '../../../src/adapter/adapter.js';
import { ContainerModule, inject } from '../../../src/container/container.js';
import { AegisComponent } from '../../../src/element/aegis-component.js';
import { customElement } from '../../../src/element/aegis-element.js';


export class AegisTestAdapter extends Adapter {

	@inject('test-value') protected testValue: string;

	public override render(): unknown {
		return html`
		Hello from aegis adapter.
		${ this.testValue }
		`;
	}

}


@customElement('aegis-test-component')
export class AegisTestComponent extends AegisComponent {

	constructor() {
		super(AegisTestAdapter, async () => containerModule);
	}

}


const containerModule = new ContainerModule(({ bind }) => {
	bind('test-value').toConstantValue('Hello I am a constant value');
});
