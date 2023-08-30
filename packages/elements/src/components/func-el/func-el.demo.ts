import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { component } from './component.js';
import { useConnected, useEffect, useProperty, useState, useStyles } from './use.js';


@customElement('mm-func-el-demo')
export class FuncElDemo extends LitElement {

	protected override render() {
		return html`
		<button @click=${ () => void this.requestUpdate() }>UPDATE</button>
		<test-div label="jeg er en label"></test-div>
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


const testDivCmp = component('test-div', () => {
	const [ label, setLabel ] = useProperty('label', 'test-label', { type: String });
	const [ counter, setCounter ] = useState('counter', 0, { type: Number });

	useStyles(css`
		button {
			background-color: hotpink;
			width: 200px;
			height: 100px;
		}
	`);

	useConnected((element) => {
		console.log('connected', element);
	});

	useEffect((props) => {
		console.log('effect!', props);
	}, [ 'label' ]);

	return () => html`
	<button @click=${ () => setCounter(counter.value + 1) }>
		${ label?.value } ${ counter.value }
	</button>

	<input @input=${ (ev: InputEvent) => setLabel((ev.target as any).value) } />
	`;
});

testDivCmp.register();
