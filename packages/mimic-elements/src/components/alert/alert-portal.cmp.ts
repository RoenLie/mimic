import { paintCycle } from '@roenlie/mimic-core/async';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { css, LitElement, render } from 'lit';
import { customElement } from 'lit/decorators.js';

import { IAlertDefinition } from './alert-setup-api.js';

if (!customElements.get('mm-alert'))
	import('./alert.cmp.js');


@customElement('mm-alert-portal')
export class AlertPortalCmp extends LitElement {

	public async display(definition: IAlertDefinition) {
		const { properties, template } = definition;

		const alert = Object.assign(document.createElement('mm-alert'), {
			variant:  properties.variant ?? 'primary',
			closable: properties.closeable ?? true,
			duration: properties.duration ?? 5000,
		});

		render(template(alert), alert);
		paintCycle().then(async () => alert.toast());
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			position: content;
			position: fixed;
			top: 0;
			inset-inline-end: 0;
			z-index: var(--index-toast);
			width: 28rem;
			max-width: 100%;
			max-height: 100%;
			overflow: auto;
		}
		mm-alert {
			--box-shadow: var(--box-shadow-m);
			margin: var(--spacing-m);
		}
	`,
	];

}


declare global {
	interface HTMLElementTagNameMap {
		'mm-alert-portal': AlertPortalCmp;
	}
}


export const alertPortal: AlertPortalCmp = Object.assign(document.createElement('mm-alert-portal'));
