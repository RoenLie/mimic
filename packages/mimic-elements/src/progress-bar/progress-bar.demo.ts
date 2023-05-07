import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';


@customElement('mm-progress-bar-demo')
export class ProgressBarDemo extends LitElement {

	protected override render() {
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
