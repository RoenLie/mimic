import { SlotController } from '@roenlie/mimic-lit/controllers';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { css, html, LitElement } from 'lit';
import { customElement, property, query } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { when } from 'lit/directives/when.js';

import { RippleElement } from '../ripple/ripple.cmp.js';

(() => [ RippleElement ])();


/**
 * @property href - sets the href of the base anchor wrapper inside the component.
 * @property target - sets the target of the base anchor wrapper inside the component.
 * @property active - sets the item to active state, changing the component styling.
 * @property type - changes the styling of the component between the bare and outlined style.
 * @property role - by default makes the component generate an anchor tag as the base element.
 * If set to `button` a <button> element will be generated instead.
 */
@customElement('mm-nav-rail-item')
export class NavRailItemElement extends LitElement {

	//#region properties
	@property({ type: String }) public href?: string;
	@property({ type: String }) public target?: string;
	@property({ type: Boolean, reflect: true }) public active?: boolean;
	@property({ reflect: true }) public override role: string | null;
	@property({ reflect: true }) public type: 'bare' | 'outlined' = 'bare';
	@query('mm-ripple') protected rippleQry: RippleElement;
	//#endregion


	//#region controllers
	protected slotCtrl = new SlotController({ host: this, slotNames: [ 'icon' ] });
	//#endregion


	//#region lifecycle
	public override connectedCallback(): void {
		super.connectedCallback();

		this.setAttribute('tabindex', '0');
		this.addEventListener('mousedown', this.handleMousedown);
		this.addEventListener('keydown', this.handleKeydown);
	}

	public override disconnectedCallback(): void {
		super.disconnectedCallback();

		this.removeEventListener('mousedown', this.handleMousedown);
		this.removeEventListener('keydown', this.handleKeydown);
	}
	//#endregion


	//#region logic
	protected handleClick = (ev: PointerEvent) => {
		this.rippleQry.showRipple(ev);
	};

	protected handleMousedown = (ev: MouseEvent) => {
		if (ev.detail > 1)
			ev.preventDefault();
	};

	protected handleKeydown = (ev: KeyboardEvent) => {
		if ([ 'Enter', 'Space' ].includes(ev.key.trim() || ev.code)) {
			ev.preventDefault();
			this.rippleQry.showRipple({ x: 0, y: 0 });
		}
	};
	//#endregion


	//#region template
	protected itemContent() {
		return html`
		<div class="interact" @click=${ this.handleClick }></div>

		<mm-ripple class="icon" @click=${ this.handleClick }>
			<slot name="icon"></slot>
		</mm-ripple>

		${ when(this.slotCtrl.test('[default]'), () => html`
		<div class="text">
			<slot></slot>
		</div>
		`) }
		`;
	}


	public override render() {
		return html`
		${ when(this.role === 'button',
			() => html`
			<button class="wrapper" part="base">
				${ this.itemContent() }
			</button>
			`,
			() => html`
			<a class="wrapper"
				part="base"
				href=${ this.href ?? 'javascript:void(0);' }
				target=${ ifDefined(this.target) }
			>
				${ this.itemContent() }
			</a>
			`) }
		`;
	}
	//#endregion


	//#region style
	public static override styles = [
		sharedStyles,
		css`
		:host {
			display: block;

			--nav-item-height-default: 80px;
			height: var(--nav-item-height,var(--nav-item-height-default));
		}
		:host(:focus-visible) {
			outline: var(--focus-ring);
			outline-offset: var(--focus-offset);
			transition: var(--focus-transition);
			z-index: var(--focus-index);
			border-radius: var(--border-radius-m);
		}
		.wrapper {
			position: relative;
			display: flex;
			flex-flow: column nowrap;
			align-items: stretch;
			justify-content: center;
			height: 100%;
			width: 72px;
			gap: 4px;
		}
		.interact {
			content: '';
			position: absolute;
			inset: 0;
		}
		.icon {
			align-self: center;
			cursor: pointer;
			position: relative;
			display: grid;
			place-items: center;
			width: 56px;
			height: 32px;
			border-radius: 32px;
			overflow: hidden;
		}
		.icon::before {
			content: '';
			position: absolute;
			inset: 0;
			border-radius: inherit;
		}
		:host mm-ripple {
			--ripple-bg: var(--on-primary-press);
		}
		:host([active]) .icon {
			background-color: var(--primary);
			color: var(--on-primary);
		}
		@media (pointer: fine) {
			.interact:hover ~ .icon,
			.icon:hover {
				color: var(--on-primary);
			}
			.interact:hover ~ .icon::before,
			.icon:hover::before {
				background-color: var(--primary-hover);
			}
			:host([active]) .interact:hover ~ .icon::before,
			:host([active]) .icon:hover::before {
				background-color: var(--primary-hover);
			}
		}
		:host([type="outlined"]) .icon {
			border: 2px solid var(--outline-variant);
		}
		.text {
			color: var(--on-background);
			display: grid;
			text-align: center;
		}
		`,
	];
	//#endregion

}


declare global {
	interface HTMLElementTagNameMap {
		'mm-nav-rail-item': NavRailItemElement;
	}
}
