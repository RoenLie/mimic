import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { component } from '../../src/core/component.js';
import { useAfterConnected } from '../../src/hooks/use-after-connected.js';
import { useConnected } from '../../src/hooks/use-connected.js';
import { useProperty, useState } from '../../src/hooks/use-property.js';
import { useQuery } from '../../src/hooks/use-query.js';
import { useStyles } from '../../src/hooks/use-styles.js';
import { useUpdated } from '../../src/hooks/use-updated.js';


@customElement('demo-introduction')
export class DemoIntroduction extends LitElement {

	protected override render() {
		return html`
		<new-demo></new-demo>
		`;
	}

}


component('new-demo', () => {
	const buttonQry = useQuery<DemoButton>('buttonQry', 'demo-button');

	useAfterConnected(() => {
		console.log(buttonQry.value);
	});

	return () => html`
	<demo-button></demo-button>
	`;
}).register();


interface DemoButton extends LitElement {
	label: string;
}

component('demo-button', () => {
	const [ label, setLabel ] = useProperty('label', 'test-label', { type: String });
	const [ counter, setCounter ] = useState('counter', 0, { type: Number });
	const subCounter = 0;
	const inputQry = useQuery('inputQry', 'input');

	useStyles(css`
		button {
			background-color: hotpink;
			width: 200px;
			height: 100px;
		}
	`);

	useConnected((element) => {
		console.log('connected');
		console.dir(element.constructor);
	});

	useAfterConnected(() => {
		console.log('after connected!', inputQry.value);
	});

	useUpdated((props) => {
		console.log('effect!', props);
	}, [ 'counter' ]);


	return () => html`
	<button @click=${ () => setCounter(counter.value + 1) }>
		${ label?.value } ${ counter.value } ${ subCounter }
	</button>

	<input @input=${ (ev: InputEvent) => setLabel((ev.target as any).value) } />
	`;
}).register();
