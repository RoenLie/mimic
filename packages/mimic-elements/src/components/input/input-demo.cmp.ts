import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';


@customElement('mm-input-demo')
export class InputDemo extends LitElement {

	public override render() {
		return html`
		<mm-input label="Label" size="large"></mm-input>
		<mm-input label="Label" size="medium"></mm-input>
		<mm-input label="Label" size="small"></mm-input>
		<mm-input label="Label" placeholder="Placeholder" size="large"></mm-input>
		<mm-input label="Label" placeholder="Placeholder" size="medium"></mm-input>
		<mm-input label="Label" placeholder="Placeholder" size="small"></mm-input>
		<mm-input label="Label" value="Value" size="large"></mm-input>
		<mm-input label="Label" value="Value" size="medium"></mm-input>
		<mm-input label="Label" value="Value" size="small"></mm-input>
		`;
	}

	public static override styles = [
		css`
		:host {
			display: flex;
			flex-flow: column;
			gap: 8px;
		}
	`,
	];

}


declare global {
	interface HTMLElementTagNameMap {
		'mm-input-demo': InputDemo;
	}
}
