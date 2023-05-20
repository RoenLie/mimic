import { css, html, LitElement, PropertyValues } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { unsafeHTML } from 'lit/directives/unsafe-html.js';

import { requestIcon } from './icon.js';


let parser: DOMParser;


@customElement('mm-icon')
export class IconElement extends LitElement {

	/** Can be set to change default behavior. */
	public static mutator = (svg: SVGElement) => {
		svg.setAttribute('fill', 'currentColor');
		svg.removeAttribute('height');
		svg.removeAttribute('width');
	};

	@property() public url: string;
	@property() public template: string;
	@state() protected svg: string;

	protected override update(props: PropertyValues) {
		super.update(props);

		if (props.has('url') || props.has('template'))
			this.setSvg();
	}

	protected async getSvg() {
		parser ??= new DOMParser();

		let svg = '';
		if (this.url) {
			const file = await requestIcon(this.url);
			if (!file.ok)
				return '';

			svg = file.svg;
		}
		else if (this.template) {
			svg = this.template;
		}
		else {
			return '';
		}

		const doc = parser.parseFromString(svg, 'text/html');
		const svgEl = doc.body.querySelector('svg');
		if (!svgEl)
			return '';

		IconElement.mutator(svgEl);

		return svgEl.outerHTML;
	}

	protected async setSvg() {
		this.svg = await this.getSvg();
	}

	protected override render() {
		return html`
		<div role="img">
			${ unsafeHTML(this.svg) }
		</div>
		`;
	}

	public static override styles = [
		css`
		:host {
			display: inline-grid;
			place-items: center;
			height: max-content;
			width: max-content;
		}
		div {
			contain: strict;
			box-sizing: content-box;
			display: flex;
			place-items: center;
			flex-flow: column nowrap;
		}
		div, svg {
			width: 1em;
			height: 1em;
		}
		svg {
			display: block;
		}
		`,
	];

}


declare global {
	interface HTMLElementTagNameMap {
		'mm-icon': IconElement;
	}
}
