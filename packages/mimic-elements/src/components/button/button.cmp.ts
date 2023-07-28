import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { css, html, LitElement } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';


export type ButtonType = '' | 'icon';
export type ButtonSize = 'x-small' | 'small' | 'medium' | 'large' | 'x-large';
export type ButtonShape = 'sharp' | 'rounded' | 'pill';
export type ButtonVariant =
| 'primary'
| 'primary-variant'
| 'secondary'
| 'tertiary'
| 'neutral'
| 'error'
| 'elevated'
| 'warning'
| 'success'
| 'text'
| 'outline';


@customElement('mm-button')
export class ButtonElement extends LitElement {

	@property({ type: String }) public type: ButtonType = '';
	@property() public size: ButtonSize = 'medium';
	@property() public shape: ButtonShape = 'pill';
	@property() public variant: ButtonVariant = 'primary';
	@property({ type: Boolean, reflect: true }) public disabled?: boolean;

	public override render() {
		return html`
		<mm-ripple
			?disabled=${ this.disabled }
			class=${ classMap({
				[this.type]:    true,
				[this.size]:    true,
				[this.shape]:   true,
				[this.variant]: true,
			}) }
		>
			<button
				?disabled=${ !!this.disabled }
				part="base"
				class=${ classMap({
					base:           true,
					[this.type]:    true,
					[this.size]:    true,
					[this.shape]:   true,
					[this.variant]: true,
				}) }
			>
				<slot name="prefix"></slot>
				<slot></slot>
				<slot name="suffix"></slot>
			</button>
		</mm-ripple>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			--color-button-bg: 0 0 0;
			--color-button-txt: 0 0 0;

			position: relative;
			display: block;
			width: fit-content;
			height: fit-content;
			text-align: initial;
		}
		:host([disabled=""]) {
			opacity: 0.5;
			pointer-events: none;
		}
		button {
			all: unset;
			position: relative;
			display: grid;
			grid-template-areas: "prefix text suffix";
			grid-template-columns: auto 1fr auto;
			place-items: center;
			padding-inline: var(--spacing-xxl);
			background-color: var(--color-button-bg);
			color: var(--color-button-txt);
			cursor: pointer;
		}
		button:focus-visible::after {
			content: '';
			inset: 0;
			position: absolute;
			outline: var(--focus-ring);
			outline-offset: var(--focus-offset);
			transition: var(--focus-transition);
			z-index: var(--focus-index);
			border-radius: inherit;
		}
		button:active::after {
			outline-offset: 1px;
		}
		button.x-small  {
			height: 20px;
			padding-inline: 12px;
			font-size: 12px;
		}
		button.small {
			height: 30px;
			padding-inline: 18px;
			font-size: 14px;
		}
		button.medium {
			height: 40px;
			padding-inline: 24px;
			font-size: 16px;
		}
		button.large {
			height: 50px;
			padding-inline: 24px;
			font-size: 18px;
		}
		button.x-large {
			height: 60px;
			padding-inline: 24px;
			font-size: 20px;
		}
		button.icon {
			padding: 0;
			aspect-ratio: 1;
		}
		button.sharp,
		mm-ripple.sharp {
			border-radius: var(--border-radius-xs);
		}
		button.rounded,
		mm-ripple.rounded {
			border-radius: var(--border-radius-m);
		}
		button.pill,
		mm-ripple.pill {
			border-radius: var(--border-pill);
		}
		mm-ripple.primary {
			--ripple-bg: var(--on-primary-press);
			--color-button-bg: var(--primary);
			--color-button-txt: var(--on-primary);
		}
		mm-ripple.primary-variant {
			--ripple-bg: var(--on-primary-container-press);
			--color-button-bg: var(--primary-container);
			--color-button-txt: var(--on-primary-container);
		}
		mm-ripple.secondary {
			--ripple-bg: var(--on-secondary-container-press);
			--color-button-bg: var(--secondary-container);
			--color-button-txt: var(--on-secondary-container);
		}
		mm-ripple.tertiary {
			--ripple-bg: var(--on-tertiary-container-press);
			--color-button-bg: var(--tertiary-container);
			--color-button-txt: var(--on-tertiary-container);
		}
		mm-ripple.neutral {
			--ripple-bg: var(--on-surface-variant-press);
			--color-button-bg: var(--surface-variant);
			--color-button-txt: var(--on-surface-variant);
		}
		mm-ripple.error {
			--ripple-bg: var(--on-error-container-press);
			--color-button-bg: var(--error-container);
			--color-button-txt: var(--on-error-container);
		}
		mm-ripple.warning {
			--ripple-bg: var(--on-warning-press);
			--color-button-bg: var(--warning);
			--color-button-txt: var(--on-warning);
		}
		mm-ripple.success {
			--ripple-bg: var(--on-success-container-press);
			--color-button-bg: var(--success-container);
			--color-button-txt: var(--on-success-container);
		}
		mm-ripple.text {
			--ripple-bg: var(--primary-press);
			--color-button-bg: none;
			--color-button-txt: var(--primary);
		}
		mm-ripple.outline {
			--ripple-bg: var(--primary-press);
			--color-button-txt: var(--primary);
		}
		button.outline {
			outline: 1px solid var(--outline);
		}
		mm-ripple.elevated {
			--ripple-bg: var(--primary-press);
			--color-button-txt: var(--primary);
			backdrop-filter: blur(2px);
		}
		button.text,
		button.outline,
		button.elevated {
			transition: box-shadow var(--transition-fast) ease-in-out;
		}
		button.elevated {
			box-shadow: var(--box-shadow-s);
		}
		button.text:hover,
		button.outline:hover,
		button.elevated:hover {
			box-shadow: var(--box-shadow-m);
		}
		::slotted(*) {
			grid-area: text;
		}
		slot[name=prefix]::slotted(*) {
			grid-area: prefix;
			padding-right: 8px;
			margin-left: -8px;
		}
		slot[name=suffix]::slotted(*) {
			grid-area: suffix;
			padding-left: 8px;
			margin-right: -8px;
		}
		`,
	];

}


declare global {
	interface HTMLElementTagNameMap {
		'mm-button': ButtonElement;
	}
}
