import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';


declare global { interface HTMLElementTagNameMap {
	'mm-typeahead-demo': TypeaheadDemo;
} }


@customElement('mm-typeahead-demo')
export class TypeaheadDemo extends LitElement {

	public override render() {
		return html`
		<mm-typeahead
			openOnFocus
			openOnClick
			label="hei der"
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
		`,
	];

}
