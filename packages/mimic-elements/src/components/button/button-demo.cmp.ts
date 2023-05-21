import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';
import { map } from 'lit/directives/map.js';


@customElement('mm-button-demo')
export class ButtonDemo extends LitElement {

	protected variants = [
		'primary',
		'primary-variant',
		'secondary',
		'tertiary',
		'neutral',
		'error',
		'elevated',
		'warning',
		'success',
		'text',
		'outline',
	];

	protected shapes = [ 'sharp', 'rounded', 'pill' ];

	protected sizes = [ 'small', 'medium', 'large' ];

	public override render() {
		return html`
		${ map(this.shapes, shape => html`
		<section>
			<span>${ shape }</span>
			<div class="actions">
				${ map(this.variants, variant => html`
				<div>
					<span>${ variant }</span>
					<mm-button variant=${ variant } shape=${ shape }>
						<mm-icon url="https://icons.getbootstrap.com/assets/icons/chevron-left.svg" slot="prefix"></mm-icon>
						<span>New</span>
						<mm-icon url="https://icons.getbootstrap.com/assets/icons/chevron-right.svg" slot="suffix"></mm-icon>
					</mm-button>
				</div>
				`) }
			</div>
		</section>
		`) }
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			padding-block: 12px;
			display: grid;
			gap: 12px;
		}

		section {
			display: grid;
			place-items:  center;
		}
		.actions {
			display: flex;
			flex-flow: row wrap;
			padding: 12px;
			gap: 8px;
		}
		.actions>div {
			display: grid;
			place-items: center;
			gap: 4px;
		}
	`,
	];

}


declare global {
	interface HTMLElementTagNameMap {
		'mm-button-demo': ButtonDemo;
	}
}
