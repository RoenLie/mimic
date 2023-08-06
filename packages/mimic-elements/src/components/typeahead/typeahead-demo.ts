import { format } from '@roenlie/mimic-core/string';
import { loadTerms, tTerm } from '@roenlie/mimic-lit/localize';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';


declare global { interface HTMLElementTagNameMap {
	'mm-typeahead-demo': TypeaheadDemo;
} }


loadTerms('en', [ [ 'typeahead.label', 'I AM A {0}' ] ]);
setTimeout(() => {
	loadTerms('en', [ [ 'typeahead.label', 'I THE {0}' ] ]);
}, 2000);


@customElement('mm-typeahead-demo')
export class TypeaheadDemo extends LitElement {

	public override render() {
		return html`
		<mm-typeahead
			openOnFocus
			openOnClick
			label=${ tTerm('typeahead.label', text => format(text, 'PLUM!')) }
		>
			${ map(range(200), () => html`
			<mm-typeahead-item>
				Stuff
			</mm-typeahead-item>
			`) }

			<mm-typeahead-item
				slot="action"
			>
				Do something
			</mm-typeahead-item>

			<mm-typeahead-item
				slot="action"
			>
				Do something
			</mm-typeahead-item>
		</mm-typeahead>
		`;
	}

	public static override styles = [
		css`
		:host {
			display: block;
			height: 200px;
			aspect-ratio: 1;
		}
		.testbox {
			overflow: auto;
			height: 200px;
			aspect-ratio: 1;
			display: flex;
			flex-flow: column nowrap;
			border: 2px solid hotpink;
		}
		`,
	];

}
