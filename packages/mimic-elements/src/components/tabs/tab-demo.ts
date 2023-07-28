import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';


@customElement('mm-tabs-demo')
export class TabsDemoCmp extends LitElement {

	public override render() {
		return html`
		<mm-tab-group>
			<mm-tab slot="nav" panel="general">General</mm-tab>
			<mm-tab slot="nav" panel="custom">Custom</mm-tab>
			<mm-tab slot="nav" panel="advanced">Advanced</mm-tab>
			<mm-tab slot="nav" panel="disabled" disabled>Disabled</mm-tab>
			<mm-tab slot="nav" panel="disabled2" >Disabled2</mm-tab>

			<mm-tab-panel name="general">This is the general tab panel.</mm-tab-panel>
			<mm-tab-panel name="custom">This is the custom tab panel.</mm-tab-panel>
			<mm-tab-panel name="advanced">This is the advanced tab panel.</mm-tab-panel>
			<mm-tab-panel name="disabled">This is a disabled tab panel.</mm-tab-panel>
			<mm-tab-panel name="disabled2">
				<mm-dummy></mm-dummy>
			</mm-tab-panel>
		</mm-tab-group>
		`;
	}

	public static override styles = [
		css`
		:host {
			display: flex;
		}
	`,
	];

}


@customElement('mm-dummy')
class DummyTest extends LitElement {

	public override connectedCallback(): void {
		super.connectedCallback();

		console.log('dummy hidden component connected.');
	}

}
