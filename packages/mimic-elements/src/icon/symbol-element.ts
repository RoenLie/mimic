import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';


@customElement('mm-symbol')
export class SymbolElement extends LitElement {

	@property() public source = '';
	@property() public icon = '';

	public override connectedCallback(): void {
		super.connectedCallback();
		this.setAttribute('inert', '');
	}

	public override render() {
		return html`
		<svg xmlns="http://www.w3.org/2000/svg" fill="currentColor">
			<use href=${ this.source + '#' + this.icon }></use>
		</svg>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			contain: strict;
			box-sizing: content-box;
			display: grid;
			place-items: center;
		}
		:host,  svg {
			width: 1em;
			height: 1em;
		}
	`,
	];

}


declare global {
	interface HTMLElementTagNameMap {
		'mm-symbol': SymbolElement;
	}
}
