import { css, html, LitElement } from 'lit';
import { customElement } from 'lit/decorators/custom-element.js';

import { systemIcons } from '../utilities/system-icons.js';


@customElement('mm-nav-rail-demo')
export class NavRailDemo extends LitElement {

	protected override render() {
		return html`
		<nav>
			<mm-nav-rail>
				<mm-nav-rail-item slot="start" active>
					<mm-icon
						slot="icon"
						.template=${ systemIcons.airplaneEngines }
					></mm-icon>
					<span>Home</span>
				</mm-nav-rail-item>

				<mm-nav-rail-item slot="start">
					<mm-icon
						slot="icon"
						.template=${ systemIcons.airplaneEngines }
					></mm-icon>
					<span>Work</span>
				</mm-nav-rail-item>

				<mm-nav-rail-item slot="end" type="outlined">
					<mm-icon
						slot="icon"
						.template=${ systemIcons.airplaneEngines }
					></mm-icon>
					<span>Sleep</span>
				</mm-nav-rail-item>
			</mm-nav-rail>
		</nav>
		`;
	}

	public static override styles = [
		css`
		:host {
			display: grid;
			height: 300px;
		}
		nav {
			width: 90px;
			border-right: 1px solid black;
		}
		`,
	];

}
