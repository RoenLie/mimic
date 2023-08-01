import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';


@customElement('mm-field')
export class MMField extends LitElement {

	public override render() {
		return html`
		<slot></slot>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
	`,
	];

}


declare global {
	interface HTMLElementTagNameMap {
		'mm-field': MMField;
	}
}
