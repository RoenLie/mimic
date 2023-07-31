import { emitEvent, EventOf } from '@roenlie/mimic-core/dom';
import { Enum, InferEnum } from '@roenlie/mimic-core/enum';
import { sharedStyles } from '@roenlie/mimic-lit/styles';
import { css, html, LitElement } from 'lit';
import { customElement, property, query, state } from 'lit/decorators.js';
import { ifDefined } from 'lit/directives/if-defined.js';
import { live } from 'lit/directives/live.js';
import { styleMap } from 'lit/directives/style-map.js';
import { when } from 'lit/directives/when.js';


declare global { interface HTMLElementTagNameMap {
	'mm-typeahead': MMTypeahead
	'mm-typeahead-item': MMTypeaheadItem
} }


export type TypeaheadEvents = InferEnum<typeof typeaheadEvents>;
export const typeaheadEvents = Enum('mm-clear', 'mm-select-item');


@customElement('mm-typeahead')
export default class MMTypeahead extends LitElement {

	@property() public name?: string;
	@property() public value?: string;
	@property() public height?: string;
	@property() public placeholder?: string;
	@property({ type: Boolean }) public disabled?: boolean;
	@property({ type: Boolean }) public openOnFocus?: boolean;
	@property({ type: Boolean }) public openOnInput?: boolean;
	@property({ type: Boolean }) public openOnClick?: boolean;
	@property({ type: Boolean }) public closeOnSelect?: boolean;
	@property({ type: Boolean }) public showClearWhenDisabled?: boolean;
	@state() public open = false;
	@query('slot') protected slotEl?: HTMLSlotElement;
	@query('input') protected inputEl?: HTMLInputElement;
	@query('input-container') protected inputWrapperEl?: HTMLElement;
	public activeEl?: MMTypeaheadItem;
	protected resizeObs = new ResizeObserver(() => this.requestUpdate());

	public override connectedCallback(): void {
		super.connectedCallback();

		this.updateComplete.then(() => {
			if (this.inputEl)
				this.resizeObs.observe(this.inputEl);
		});
	}

	public override focus(options?: FocusOptions): void {
		if (this.disabled && this.showClearWhenDisabled) {
			const buttonEl = this.renderRoot.querySelector<HTMLButtonElement>(
				'input-container button',
			);

			buttonEl?.focus();
		}
		else {
			this.inputEl?.focus(options);
		}
	}

	protected focusItem(item?: MMTypeaheadItem) {
		this.querySelectorAll('*').forEach((el) =>
			el instanceof MMTypeaheadItem
				? el.classList.toggle('active', false)
				: undefined);

		this.activeEl = item;
		this.activeEl?.classList.toggle('active', true);
	}

	protected selectItem(item: MMTypeaheadItem) {
		this.inputEl?.focus();
		emitEvent(item, typeaheadEvents.mmSelectItem);

		if (this.closeOnSelect)
			this.open = false;
	}

	protected handleInput(ev: EventOf<HTMLInputElement>) {
		if (!this.open && this.openOnInput)
			this.open = true;

		this.value = ev.target.value;
	}

	protected handleClick() {
		if (!this.open && this.openOnClick)
			this.open = true;
	}

	protected handleFocus() {
		if (!this.open && this.openOnFocus)
			this.open = true;
	}

	protected handleBlur() {
		this.open = false;
	}

	protected async handleInputKeydown(ev: KeyboardEvent) {
		if (ev.code === 'ArrowUp' || ev.code === 'ArrowDown') {
			ev.preventDefault();

			const wasClosed = !this.open;
			if (!this.open) {
				this.open = true;
				await this.updateComplete;
			}

			if (!this.activeEl) {
				this.activeEl = this.slotEl?.assignedElements().at(0) as
					| MMTypeaheadItem
					| undefined;
			}

			if (this.activeEl) {
				const nextEl =
					ev.code === 'ArrowUp'
						? this.activeEl.previousElementSibling
						: this.activeEl.nextElementSibling;

				if (!wasClosed && nextEl instanceof MMTypeaheadItem)
					this.focusItem(nextEl);

				this.activeEl.scrollIntoView({ block: 'nearest' });
			}
		}

		if (ev.key === 'Enter') {
			const slot = this.activeEl?.assignedSlot;
			if (slot?.name === 'action') {
				const event = new KeyboardEvent('keydown', ev);
				this.activeEl?.dispatchEvent(event);
			}
			else if (this.activeEl) {
				ev.preventDefault();
				this.selectItem(this.activeEl);
			}
		}

		if (ev.key === 'Tab') {
			const actionSlotEl = this.renderRoot.querySelector<HTMLSlotElement>(
				'slot[name="action"]',
			);
			const slotContent = actionSlotEl?.assignedElements();
			const firstEl = slotContent?.at(0);

			if (
				firstEl instanceof MMTypeaheadItem &&
				firstEl !== this.activeEl
			) {
				ev.preventDefault();
				ev.stopPropagation();

				this.focusItem(firstEl);
			}
		}

		if (ev.key === 'Delete') {
			ev.preventDefault();
			emitEvent(this, typeaheadEvents.mmClear);
		}

		if (ev.key === 'Escape') {
			ev.preventDefault();
			this.open = false;
		}
	}

	protected handleDefaultSlotChange(ev: EventOf<HTMLSlotElement>) {
		const slotContent = ev.target.assignedElements();

		const previousExists = slotContent.some((el) => el === this.activeEl);
		if (!previousExists) {
			this.activeEl = undefined;

			const firstEl = slotContent.at(0) as
				| MMTypeaheadItem
				| undefined;

			if (firstEl)
				this.focusItem(firstEl);
		}

		this.updateComplete.then(
			() => this.activeEl?.scrollIntoView({ block: 'center' }),
		);
	}

	protected handleDropdownClick(ev: PointerEvent) {
		ev.preventDefault();

		const path = ev.composedPath();
		const el = path.find(
			(el): el is MMTypeaheadItem =>
				el instanceof MMTypeaheadItem,
		);

		if (el?.assignedSlot?.name)
			return;

		if (el) {
			if (this.activeEl !== el)
				this.focusItem(el);

			this.selectItem(el);
		}
	}

	public override render() {
		return html`
		<input-container part="input-container">
			<input
				placeholder=${ ifDefined(this.placeholder) }
				.value=${ live(this.value ?? '') }
				?disabled=${ this.disabled }
				@input=${ this.handleInput }
				@click=${ this.handleClick }
				@keydown=${ this.handleInputKeydown }
				@focus=${ this.handleFocus }
				@blur=${ this.handleBlur }
			/>
			${ when(
				(this.value && this.showClearWhenDisabled && this.disabled) ||
					(this.value && !this.disabled),
				() => html`
				<button
					tabindex=${ this.disabled && this.showClearWhenDisabled
						? '0' : '-1' }
					@mousedown=${ (ev: MouseEvent) => ev.preventDefault() }
					@click=${ () => emitEvent(this, typeaheadEvents.mmClear) }
				>
					<mm-icon
						style="color: rgb(0 0 0 / 70%);"
						url="/Dart/x-circle.svg"
					></mm-icon>
				</button>
				`,
			) }
		</input-container>

		${ when(this.open, () => {
			const rects = this.inputWrapperEl?.getBoundingClientRect();

			return html`
			<input-dropdown
				part="input-dropdown"
				style=${ styleMap({
					top:    rects?.bottom + 'px',
					left:   rects?.left + 'px',
					width:  rects?.width + 'px',
					height: this.height ?? '150px',
				}) }
				@mousedown=${ this.handleDropdownClick }
			>
				<ol>
					<slot @slotchange=${ this.handleDefaultSlotChange }></slot>
				</ol>

				<div class="action">
					<slot name="action"></slot>
				</div>
			</input-dropdown>
			`;
		}) }
		`;
	}

	public static override styles = [
		sharedStyles,
		css`
		/* variables */
		:host {
		}
		`,
		css`
		:host {
			position: relative;
			display: grid;
		}
		input-container {
			display: grid;
			grid-template-columns: 1fr max-content;
			border: 1px solid black;
		}
		input-container input {
			all: unset;
			width: 100%;
			text-align: center;
			border-radius: 2px;
			box-sizing: border-box;
			grid-column: 1/3;
			grid-row: 1/2;
		}
		input-container input:focus-within {
			box-shadow: inset 0 0 2px black;
		}
		input-container button {
			grid-column: 2/3;
			grid-row: 1/2;
			place-self: center;
			display: grid;
			place-items: center;
			margin-right: 4px;
			cursor: pointer;
		}
		input-container button:focus-visible {
			outline: 1px solid rgb(200 200 200 / 50%);
			border-radius: 999px;
			box-shadow: 0 0 3px 3px rgb(0 0 0 / 50%);
		}
		input-dropdown {
			overflow: hidden;
			position: fixed;
			display: grid;
			grid-template-rows: 1fr max-content;

			background-color: rgb(250, 250, 250);
			border-bottom-left-radius: 8px;
			border-bottom-right-radius: 8px;
			border: 1px solid black;
			border-top: none;
		}
		ol,
		li {
			all: unset;
		}
		ol {
			display: flex;
			flex-flow: column nowrap;
			overflow: auto;
		}
		.action {
			border-top: 1px solid black;
		}
		`,
	];

}

@customElement('mm-typeahead-item')
export class MMTypeaheadItem extends LitElement {

	public override role = 'listitem';
	public value?: any;

	public override render() {
		return html`<slot></slot>`;
	}

	public static override styles = [
		css`
		:host {
			display: grid;
			padding-inline: 12px;
			cursor: pointer;
			border: 1px solid transparent;
		}
		:host(:hover) {
			background-color: rgb(180 204 185 / 25%);
		}
		:host(.active) {
			background-color: rgb(180 204 185);
		}
		`,
	];

}
