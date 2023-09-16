import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { css, html } from 'lit';


@customElement('mm-header')
export class MMHeader extends MimicElement {

	public override connectedCallback(): void {
		super.connectedCallback();
	}

	public override render() {
		return html`
		<div class="indicator"></div>
		<slot></slot>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			display: flex;
			align-items: center;
			padding-right: var(--spacing-s);
			margin-inline: var(--spacing-s);
			height: 55px;
			gap: var(--spacing-m);
			border-radius: var(--spacing-s);
		}
		.indicator {
			padding-right: var(--spacing-s);
		}
	`,
	];

}


declare global {
	interface HTMLElementTagNameMap {
		'mm-header': MMHeader;
	}
}
