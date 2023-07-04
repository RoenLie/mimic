import './dialog-element.js';

import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { systemIcons } from '../../utilities/system-icons.js';


@customElement('mm-dialog-demo')
export class DialogDemo extends LitElement {

	protected handleClick() {
		const el = document.createElement('mm-dialog');
		el.modal = false;
		el.createConfig(() => {})
			.actions(() => {})
			.template({
				render: (dialog) => html`
				<div class="header">
					header

					<mm-icon
						template=${ systemIcons.xLg }
						@click=${ () => dialog.close() }
					></mm-icon>
				</div>

				<div class="body">
					body
				</div>
				`,
				style: css`
				.host {
					display: grid;
					grid-template-rows: auto 1fr;
					aspect-ratio: 1;
					height: 200px;
				}
				.header {
					display: grid;
					grid-template-columns: 1fr auto;
					align-items: center;
				}
				`,
			});

		this.renderRoot.append(el);

		el.complete.then(() => console.log('dialog closed'));
	}

	protected override render() {
		return html`
		<mm-button @click=${ this.handleClick }>OPEN</mm-button>
		`;
	}

	public static override styles = [
		css`
		:host {
			display: grid;
		}
		`,
	];

}
