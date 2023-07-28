import { domId } from '@roenlie/mimic-core/dom';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';


declare global { interface HTMLElementTagNameMap {
	'mm-tab-panel': TabPanelElement;
} }


/**
 * @slot - The tab panel's content.
 *
 * @csspart base - The component's internal wrapper.
 *
 * @cssproperty --padding - The tab panel's padding.
 */
@customElement('mm-tab-panel')
export class TabPanelElement extends LitElement {

	//#region properties
	/** The tab panel's name. */
	@property({ reflect: true }) public name = '';

	/** When true, the tab panel will be shown. */
	@property({ type: Boolean, reflect: true }) public active = false;

	private readonly attrId = domId();
	private readonly componentId = `mm-tab-panel-${ this.attrId }`;
	//#endregion


	//#region lifecycle
	public override connectedCallback() {
		super.connectedCallback();
		this.id = this.id.length > 0 ? this.id : this.componentId;
	}
	//#endregion


	//#region logic
	//#endregion


	//#region template
	public override render() {
		this.style.display = this.active ? 'block' : 'none';

		return html`
		<div
			part="base"
			class="tab-panel"
			role="tabpanel"
			aria-hidden=${ this.active ? 'false' : 'true' }
		>
			<slot></slot>
		</div>
		`;
	}
	//#endregion


	//#region style
	public static override styles = [
		sharedStyles,
		css`
		:host {
			display: block;
			overflow: hidden;
		}
		.tab-panel {
			height: 100%;
			border: solid 1px transparent;
			padding: var(--tab-padding, 0);
		}
		`,
	];
	//#endregion

}
