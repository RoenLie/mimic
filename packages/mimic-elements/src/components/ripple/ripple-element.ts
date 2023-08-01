import { emitEvent } from '@roenlie/mimic-core/dom';
import { type Fn } from '@roenlie/mimic-core/types';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';


/**
 * @event ripple-finished - emits when the ripple animation has finished.
 */
@customElement('mm-ripple')
export class MMRipple extends LitElement {

	//#region properties
	@property({ type: Number }) public speed = 500;
	@property({ type: Boolean, reflect: true }) public disabled?: boolean;
	protected animations = new Set<Animation>();
	//#endregion


	//#region lifecycle
	public override connectedCallback() {
		super.connectedCallback();

		this.addEventListener('mousedown', this.handleMousedown);
		this.addEventListener('click', this.handleClick);
	}

	public override disconnectedCallback() {
		super.disconnectedCallback();

		this.animations.forEach(animation => animation.cancel());
		this.animations.clear();
		const el = this.querySelector('.ripple__control');
		this.removeRipples(el);

		this.removeEventListener('mousedown', this.handleMousedown);
		this.removeEventListener('click', this.handleClick);
	}
	//#endregion


	//#region logic
	public showRipple = (ev?: { x?: number, y?: number }) => {
		if (this.disabled)
			return;

		const rippler = document.createElement('span');
		const containerEl = this.renderRoot.querySelector<HTMLElement>('.ripple__control');
		containerEl?.insertAdjacentElement('beforeend', rippler);

		const rect = this.getBoundingClientRect();
		const size = Math.trunc(rect.width);

		const style = {
			height: size + 'px',
			width:  size + 'px',
		} as Record<string, any>;

		if (ev?.x)
			style['left'] = Math.trunc(ev.x - rect.left - (size / 2)) + 'px';
		if (ev?.y)
			style['top'] = Math.trunc(ev.y - rect.top - (size / 2)) + 'px';

		Object.assign(rippler.style, style);

		const animation = rippler.animate(
			[
				{ opacity: 1, transform: 'scale(0)' },
				{ opacity: 0, transform: 'scale(2)' },
			],
			{
				easing:   'linear',
				duration: this.speed,
			},
		);

		this.animations.add(animation);

		const animationHandler = () =>
			this.handleAnimationEnd(rippler, animation, animationHandler);

		animation.addEventListener('finish', animationHandler);
		animation.addEventListener('cancel', animationHandler);
	};

	protected removeRipples(el?: Element | null) {
		while (el?.firstChild)
			el.removeChild(el.firstChild);
	}

	protected handleAnimationEnd = (
		element: Element, animation: Animation, handler: Fn,
	) => {
		animation.removeEventListener('finish', handler);
		animation.removeEventListener('cancel', handler);
		this.animations.delete(animation);

		emitEvent(this, 'ripple-finished');
		element.remove();
	};

	protected handleMousedown = (ev: MouseEvent) => {
		if (ev.detail >= 2)
			ev.preventDefault();
	};

	protected handleClick = (ev: MouseEvent) => {
		this.showRipple(ev);
	};
	//#endregion


	//#region template
	public override render() {
		return html`
		<slot></slot>
		<div class="ripple">
			<div class="ripple__control"></div>
		</div>
		`;
	}
	//#endregion


	//#region style
	public static override styles = [
		css`
		:host {
			--_ripl-color-bg: var(--ripl-color-bg, rgb(248 253 255 / .3));
			border-radius: inherit;
			position: relative;
		}
		`,
		css`
		.ripple {
			border-radius: inherit;
			pointer-events: none;
			user-select: none;
			position: absolute;
			inset: 0px;
			display: grid;
			overflow: hidden;
		}
		.ripple__control {
			position: relative;
			display: grid;
			place-items: center;
		}
		span {
			position: absolute;
			opacity: 0.75;
			border-radius: 999px;
			transform: scale(0);
			background-color: var(--_ripl-color-bg);
		}
	`,
	];
	//#endregion

}


declare global {
	interface HTMLElementTagNameMap {
		'mm-ripple': MMRipple;
	}
}
