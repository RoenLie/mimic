import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';


@customElement('mm-progress-bar-demo')
export class ProgressBarDemo extends LitElement {

	public override render() {
		return html`
		<mm-progress-bar indeterminate></mm-progress-bar>
		`;
	}

	public static override styles = [
		css`
		:host {
		}
		`,
	];

}


declare global {
	interface HTMLElementTagNameMap {
		'mm-progress-bar-demo': ProgressBarDemo;
	}
}
