import { emitEvent } from '@roenlie/mimic-core/dom';
import { css, html, LitElement } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import { when } from 'lit/directives/when.js';

import { component } from '../../src/core/component.js';
import { useAfterConnected } from '../../src/hooks/use-after-connected.js';
import { useConnected } from '../../src/hooks/use-connected.js';
import { useController } from '../../src/hooks/use-controller.js';
import { useDisconnected } from '../../src/hooks/use-disconnected.js';
import { useElement } from '../../src/hooks/use-element.js';
import { useProperty, useState } from '../../src/hooks/use-property.js';
import { useQuery } from '../../src/hooks/use-query.js';
import { useStyles } from '../../src/hooks/use-styles.js';
import { useUpdated } from '../../src/hooks/use-updated.js';


@customElement('demo-introduction')
export class DemoIntroduction extends LitElement {

	@state() protected toggle = true;

	protected override render() {
		return html`
		<button @click=${ () => this.toggle = !this.toggle }>Toggle</button>
		${ when(this.toggle, () => html`
		<new-demo></new-demo>
		`) }
		`;
	}

	public static override styles = [
		css`
		:host {
			display: grid;
			grid-auto-rows: max-content;
		}
		`,
	];

}


component('new-demo', () => {
	const buttonQry = useQuery<DemoButton>('buttonQry', 'demo-button');

	useAfterConnected(() => {
		console.log(buttonQry.value);
	});

	return () => html`
	<demo-button @stuff=${ () => console.log('button event') }></demo-button>
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

	useDisconnected(() => {
		console.log('disconnecting');
	});

	useAfterConnected(() => {
		console.log('after connected!', inputQry.value);
	});

	useUpdated((props) => {
		console.log('effect!', props);
	}, [ 'counter' ]);

	useController('testController', {
		hostUpdate() {
			console.log('controller updating');
		},
		hostConnected() {
			console.log('host connected');
		},
		hostDisconnected() {
			console.log('controller disconnecting');
		},
	});

	const emit = useElement((element) => {
		return () => {
			emitEvent(element, 'stuff');
		};
	});

	return () => html`
	<button @click=${ () => {
		setCounter(counter.value + 1);
		emit.func();
	} }>
		${ label?.value } ${ counter.value } ${ subCounter }
	</button>

	<input @input=${ (ev: InputEvent) => setLabel((ev.target as any).value) } />
	`;
}).register();
