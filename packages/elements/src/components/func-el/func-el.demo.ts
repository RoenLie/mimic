import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { component } from './component.js';
import { useProperty, useState, useStyles } from './use.js';


@customElement('mm-func-el-demo')
export class FuncElDemo extends LitElement {

	protected override render() {
		return html`
		<button @click=${ () => void this.requestUpdate() }>UPDATE</button>
		<test-div label="jeg er en label"></test-div>
		<!--<test-div></test-div>-->
		`;
	}

	public static override styles = [
		css`
		:host {
			display: grid;
		}
		`,
	];

}


const testDivCmp = component<{label: string}>('test-div', (cmp) => {
	console.log(this);

	const [ label ] = useProperty({ name: 'label', value: 'test-label' }, cmp);
	const [ counter, setCounter ] = useState({ name: 'counter', value: 0 }, cmp);

	useStyles(css`
		button {
			background-color: hotpink;
			width: 200px;
			height: 100px;
		}
	`, cmp);

	return (props, element) => html`
	<button @click=${ () => setCounter(counter.value + 1) }>
		${ label?.value } ${ counter.value }
	</button>
	`;
});

testDivCmp.register();
