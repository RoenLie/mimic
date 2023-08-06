import { format } from '@roenlie/mimic-core/string';
import { loadTerms, onLanguageChange, term, tTerm } from '@roenlie/mimic-lit/localize';
import { css, html, LitElement, noChange, type Part } from 'lit';
import { AsyncDirective, Directive, directive } from 'lit/async-directive.js';
import { customElement } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';
import { range } from 'lit/directives/range.js';
import { until } from 'lit/directives/until.js';


declare global { interface HTMLElementTagNameMap {
	'mm-typeahead-demo': TypeaheadDemo;
} }


setTimeout(() => {
	loadTerms('en', [ [ 'typeahead.label', 'I AM A {0}' ] ]);
}, 2000);


class TermDirective extends AsyncDirective {

	protected previousArgs: Parameters<typeof term>;

	protected forceUpdate = () => {
		this.setValue(until(...term(...this.previousArgs)));
	};

	override update(_part: Part, props: unknown[]) {
		onLanguageChange(this.forceUpdate, true);

		return super.update(_part, props);
	}

	protected override reconnected(): void {
		onLanguageChange(this.forceUpdate, true);
	}

	protected override disconnected(): void {
		onLanguageChange(this.forceUpdate, true);
	}

	render(...args: Parameters<typeof term>) {
		this.previousArgs = args;

		return until(...term(...args));
	}

}

const ttTerm = directive(TermDirective);

@customElement('mm-typeahead-demo')
export class TypeaheadDemo extends LitElement {

	protected test = ttTerm('typeahead.label', text => format(text, 'PLUM!'));

	public override render() {
		return html`
		<mm-typeahead
			openOnFocus
			openOnClick
			label=${ this.test }
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
