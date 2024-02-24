import { css, html } from 'lit';

import { Adapter, AegisComponent, customElement } from '../index.js';


export class MainAdapter extends Adapter {


	public override render(): unknown {
		return html`
		HELLO FROM ADAPTER
		`;
	}

	public static override styles = [
		css`
		:host {
			display: block;
			width: 200px;
			height: 100px;
			border: 2px solid red;
		}`
		,
		css`
		:host {
			border-color: blue;
		}
		`,
	];

}


@customElement('ae-main', true)
export class MainCmp extends AegisComponent {

	constructor() { super(MainAdapter); }

}
