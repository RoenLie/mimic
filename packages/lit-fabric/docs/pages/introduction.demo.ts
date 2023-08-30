import { css, html } from 'lit';

import { component } from '../../src/core/component.js';
import {
	useAfterConnected, useConnected,
	useProperty, useState,
	useStyles, useUpdated,
} from '../../src/hooks/use.js';


component('demo-introduction', () => {
	const [ label, setLabel ] = useProperty('label', 'test-label', { type: String });
	const [ counter, setCounter ] = useState('counter', 0, { type: Number });
	const subCounter = 0;

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

	useAfterConnected(() => {
		console.log('after connected!');
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
