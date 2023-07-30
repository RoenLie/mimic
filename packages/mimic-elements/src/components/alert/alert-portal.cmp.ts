import { customElement, MimicElement } from '@roenlie/mimic-lit/decorators';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { css, render } from 'lit';

import { AlertElement } from './alert.cmp.js';
import { IAlertDefinition } from './alert-setup-api.js';


declare global { interface HTMLElementTagNameMap {
	'mm-alert-portal': AlertPortalCmp;
} }


@customElement('mm-alert-portal')
export class AlertPortalCmp extends MimicElement {

	public async display(definition: IAlertDefinition) {
		const { properties, template } = definition;

		const alertEl = document.createElement(AlertElement.tagName) as AlertElement;
		const alert = Object.assign(alertEl, {
			variant:  properties.variant ?? 'primary',
			closable: properties.closeable ?? true,
			duration: properties.duration ?? 5000,
		});

		render(template(alert), alert);
		setTimeout(() => alert.toast());
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			--_alert-index: var(--mm-alert-index, 950);
		}
		`,
		css`
		:host {
			position: fixed;
			top: 0;
			right: 0;
			z-index: var(--_alert-index);
			width: 28rem;
			max-width: 100dvw;
			max-height: 100dvh;
			overflow: auto;

			display: flex;
			flex-flow: column nowrap;
			gap: 6px;
		}
	`,
	];

}


export const alertPortal = document.createElement(AlertPortalCmp.tagName) as AlertPortalCmp;
