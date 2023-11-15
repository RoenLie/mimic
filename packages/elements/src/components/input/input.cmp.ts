import { paintCycle } from '@roenlie/mimic-core/async';
import { emitEvent, type EventOf, hasKeyboardFocus } from '@roenlie/mimic-core/dom';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { css, html } from 'lit';
import { property, query, state } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';


type InputSize = 'small' | 'medium' | 'large';
type InputShape = 'sharp' | 'rounded' | 'pill';


@customElement('mm-input')
export class MMInput extends MimicElement {

	@property() public label = '';
	@property() public value = '';
	@property() public placeholder = '';
	@property({ reflect: true }) public size: InputSize = 'medium';
	@property({ reflect: true }) public shape: InputShape = 'sharp';
	@property({ type: Boolean, reflect: true, attribute: 'auto-focus' }) public autoFocus?: boolean;
	@state() protected hasKeyboardFocus = false;
	@query('input') protected inputQry: HTMLInputElement;

	protected get classes() {
		return {
			[this.size]:  true,
			[this.shape]: true,
			label:        !!this.label,
			filled:       this.value || this.placeholder,
			placeholder:  !this.value && this.placeholder,
		};
	}

	public override connectedCallback(): void {
		super.connectedCallback();

		if (this.autoFocus)
			paintCycle().then(() => this.inputQry.focus({ preventScroll: true }));
	}

	public override focus(options?: FocusOptions | undefined) {
		this.inputQry.focus(options);
	}

	protected handleFocus = () => {
		this.hasKeyboardFocus = hasKeyboardFocus(this.inputQry);
	};

	protected handleBlur = () => {
		this.hasKeyboardFocus = false;
	};

	protected handleInput = (ev: EventOf<HTMLInputElement>) => {
		this.value = ev.target.value;
	};

	protected handleChange() {
		this.value = this.inputQry.value;
		emitEvent(this, 'change');
	}

	public override render() {
		return html`
		<div class=${ classMap({ base: true, ...this.classes }) }>
			<label class=${ classMap({ input__base: true, ...this.classes }) }>
				<slot-wrapper>
					<slot name="start"></slot>
				</slot-wrapper>
				<input
					.value=${ this.value }
					.placeholder=${ this.placeholder }
					@focus=${ this.handleFocus }
					@blur=${ this.handleBlur }
					@input=${ this.handleInput }
					@change=${ this.handleChange }
				/>
				<span>${ this.label }</span>
				<slot-wrapper>
					<slot name="end"></slot>
				</slot-wrapper>
			</label>
		</div>
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		:host {
			display: flex;
		}
		.base {
			position: relative;
			width: 100%;
			display: grid;
		}
		.sharp {
			border-radius: var(--mm-border-radius-xs);
		}
		.rounded  {
			border-radius: var(--mm-border-radius-m);
		}
		.pill  {
			border-radius: var(--mm-border-pill);
		}
		.small {
			height: 30px;
			font-size: 12px;
		}
		.small span {
			top: 8px;
		}
		label.small:focus-within span,
		label.small.filled span {
			top: 4px;
			font-size: 8px;
		}
		.small.label input {
			padding-top: 12px;
		}
		.medium {
			height: 40px;
			font-size: 14px;
		}
		.medium span {
			top: 12px;
		}
		label.medium:focus-within span,
		label.medium.filled span {
			top: 5px;
			font-size: 10px;
		}
		.medium.label input {
			padding-top: 14px;
		}
		.large {
			height: 50px;
			font-size: 16px;
		}
		.large span {
			top: 16px;
		}
		label.large:focus-within span,
		label.large.filled span {
			top: 6px;
			font-size: 12px;
		}
		.large.label input {
			padding-top: 18px;
		}
		label {
			position: relative;
			display: grid;
			overflow: hidden;
			background-color: rgb(var(--mm-color-on-surface) / .04);
			grid-template: "start input end" 1fr / max-content 1fr max-content;
		}
		label>:first-of-type(slot-wrapper) {
			grid-area: start;
		}
		label>input {
			grid-area: input;
		}
		label>:last-of-type(slot-wrapper) {
			grid-area: end;
		}
		label:focus-within span,
		label.filled span {
			color: var(--mm-primary);
		}
		span {
			line-height: 1em;
			pointer-events: none;
			position: absolute;
			left: 0px;
			padding-inline: 12px;
			color: rgb(var(--mm-color-on-surface) / 0.6);
			transition: color 0.2s ease 0s, font-size 0.2s ease 0s, top 0.2s ease 0s;
		}
		label::before {
			content: '';
			position: absolute;
			bottom: 0px;
			height: 1px;
			width: 100%;
			background-color: rgb(var(--mm-color-on-surface) / 0.6)
		}
		label::after {
			content: '';
			position: absolute;
			left: 0px;
			bottom: 0px;
			height: 1px;
			background-color: var(--mm-primary);
			width: 100%;
			transform-origin: center bottom;
			transform: scaleX(0);
			transition: transform 0.3s ease 0s;
		}
		label:focus-within::after {
			transform: scaleX(1);
		}
		input {
			all: unset;
			padding-inline: 12px;
			line-height: 1em;
			color: rgb(var(--mm-color-on-surface) / 0.87);
			caret-color: var(--mm-primary);
		}
		.placeholder input {
			color: rgb(var(--mm-color-on-surface) / 0.3);
		}

		input::-moz-selection {
			color: var(--mm-on-primary);
			background: var(--mm-primary);
		}
		input::selection {
			color: var(--mm-on-primary);
			background: var(--mm-primary);
		}
		slot-wrapper {
			display: grid;
			place-items: center;
		}
	`,
	];

}


declare global {
	interface HTMLElementTagNameMap {
		'mm-input': MMInput;
	}
}
