import type { PathOf } from '@roenlie/mimic-core/types';
import { queryId } from '@roenlie/mimic-lit/decorators';
import { customElement, MimicElement } from '@roenlie/mimic-lit/element';
import { css, CSSResult, html, type TemplateResult } from 'lit';
import { property } from 'lit/decorators.js';

import { MMVirtualScrollbar } from '../virtual-scrollbar/virtual-scrollbar.cmp.js';
import { HeaderRenderController } from './header-render-controller.js';
import { RowRenderController } from './row-render-controller.js';

MMVirtualScrollbar.register();


export interface Options {
	checkbox?: boolean;
}


export interface Column<T extends Record<string, any>> {
	width?: number;
	minWidth?: number;
	defaultWidth?: number;
	resizeable?: boolean;
	label?: string;
	field?: PathOf<T>;
	headerRender?: (data: T[]) => TemplateResult<any>;
	fieldRender?: (data: T) => TemplateResult<any>;
}


@customElement('f-table')
export class FragmentTable extends MimicElement {

	@property({ type: Array }) public columns: Column<any>[] = [];
	@property({ type: Array }) public data: Record<string, any>[] = [];
	@property({ type: Object }) public options?: Options;
	@property({ type: String }) public styles?: string | CSSResult;
	@property({ type: Boolean }) public dynamic?: boolean;
	@queryId('table') protected table?: HTMLTableElement;
	@queryId('top-buffer') protected topBuffer?: HTMLElement;
	protected tablePromise: Promise<HTMLTableElement | undefined>;
	protected topBufferPromise: Promise<HTMLElement | undefined>;
	protected focusRow: number | undefined = undefined;
	protected focusedCell: number | undefined = undefined;
	protected eventOptions = { bubbles: true, cancelable: true, composed: true };
	public readonly headerRenderer = new HeaderRenderController(this);
	public readonly rowRenderer = new RowRenderController(this);

	public override connectedCallback() {
		super.connectedCallback();

		this.classList.toggle('initializing', true);
		this.tablePromise = this.updateComplete.then(() => this.table);
		this.topBufferPromise = this.updateComplete.then(() => this.topBuffer);
	}

	public override afterConnectedCallback() {
		setTimeout(() => {
			this.headerRenderer.hostAfterConnected();
			this.rowRenderer.hostAfterConnected();

			this.updateComplete.then(() => {
				this.renderRoot
					.querySelectorAll<MMVirtualScrollbar>('m-virtual-scrollbar')
					.forEach(el => el.updateHeight());

				this.classList.toggle('initializing', false);
			});
		});
	}

	protected handleHeadClick(ev: PointerEvent) {
		const path = ev.composedPath();
		const cell = path.find((el): el is HTMLTableCellElement =>
			el instanceof HTMLTableCellElement);

		const baseOptions = { bubbles: true, cancelable: true, composed: true };
		const cellEvent = new CustomEvent('header-click', { ...baseOptions, detail: cell });

		cell?.dispatchEvent(cellEvent);
	}

	protected handleBodyClick(ev: PointerEvent) {
		const path = ev.composedPath();
		const row = path.find((el): el is HTMLTableRowElement => el instanceof HTMLTableRowElement);
		const cell = path.find((el): el is HTMLTableCellElement => el instanceof HTMLTableCellElement);

		const rowEvent = new CustomEvent('row-click', { ...this.eventOptions, detail: row });
		const cellEvent = new CustomEvent('cell-click', { ...this.eventOptions, detail: cell });

		row?.dispatchEvent(rowEvent);
		cell?.dispatchEvent(cellEvent);
	}

	protected handleHeadChange(ev: Event) {
		const path = ev.composedPath();
		const checkbox = path.find(el => el instanceof HTMLInputElement && el.type === 'checkbox');

		if (checkbox) {
			const ev = new CustomEvent('row-check-all', { ...this.eventOptions, detail: checkbox });
			checkbox.dispatchEvent(ev);
		}
	}

	protected handleBodyChange(ev: Event) {
		const path = ev.composedPath();
		const checkbox = path.find(el => el instanceof HTMLInputElement && el.type === 'checkbox');

		if (checkbox) {
			const ev = new CustomEvent('row-check', { ...this.eventOptions, detail: checkbox });
			checkbox.dispatchEvent(ev);
		}
	}

	protected override render() {
		return html`
		<style>${ this.styles }</style>

		${ this.headerRenderer.DynamicStyles() }
		${ this.rowRenderer.DynamicStyles() }

		<table id="table" part="table">
			<thead @click=${ this.handleHeadClick } @change=${ this.handleHeadChange }>
				${ this.headerRenderer.Header() }
			</thead>
			<tbody @click=${ this.handleBodyClick } @change=${ this.handleBodyChange }>
				${ this.rowRenderer.Rows() }
			</tbody>
		</table>

		<m-virtual-scrollbar
			placement="end"
			direction="horizontal"
			.reference=${ this.tablePromise }
			.widthResizeRef=${ this.topBufferPromise }
		></m-virtual-scrollbar>

		<m-virtual-scrollbar
			placement="end"
			direction="vertical"
			.reference=${ this.tablePromise }
		></m-virtual-scrollbar>
		`;
	}

	public static override styles = [
		css`
		* {
			box-sizing: border-box;
		}
		m-virtual-scrollbar {
			--vscroll-size: 12px;
			--vscroll-background: rgb(100 100 100 / 90%);
		}
		m-virtual-scrollbar[direction="vertical"]::part(wrapper) {
			top: 50px;
		}
		:host(.initializing) {
			visibility: hidden;
		}
		:host {
			--_header-color:         var(--header-color, #ffffff);
			--_header-background:    var(--header-background, #009879);
			--_header-bottom-border: var(--header-bottom-border);
			--_row-height:           var(--row-height, 50px);
			--_row-background:       var(--row-background);
			--_row-even-background:  var(--row-even-background, #f3f3f3);
			--_row-bottom-border:    var(--row-bottom-border, 1px solid #dddddd);
			--_row-background-hover: var(--row-background-hover, #dddddd);
			--_table-color:          var(--table-color, black);
			--_table-background:     var(--table-background, white);
			--_table-bottom-border:  var(--table-bottom-border, 2px solid #009879);

			position: relative;
			display: grid;
			overflow: hidden;
		}
		table {
			position: relative;
			overflow: auto;
			overscroll-behavior: contain;
			display: grid;
			grid-auto-flow: row;
			grid-auto-rows: max-content;
			border-collapse: collapse;
			min-width: 100%;

			font-size: 0.9em;
			box-shadow: 0 0 4px rgba(0, 0, 0, 0.15);
			color: var(--_table-color);
			background: var(--_table-background);
			border-bottom: var(--_table-bottom-border);

			contain: content; /* Used for performance */
		}
		thead, tbody {
			display: contents;
		}
		th, td {
			display: flex;
			place-items: center start;
			padding-inline: 6px;
		}
		th, td,
		th span, td span {
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
		}
		`,
		HeaderRenderController.styles,
		RowRenderController.styles,
		css` /* Resize handle */
		.resize-handle {
			position: absolute;
			top: 0;
			right: 0;
			bottom: 0;
			background: black;
			opacity: 0;
			width: 3px;
			cursor: col-resize;
		}
		.resize-handle:hover,
		.header--being-resized .resize-handle {
			opacity: 0.5;
		}
		th:hover .resize-handle {
			opacity: 0.3;
		}
		`,
		css` /* Input checkbox styling */
		input[type="checkbox"] {
			/* Add if not using autoprefixer */
			-webkit-appearance: none;
			/* Remove most all native input styles */
			appearance: none;
			/* For iOS < 15 */
			background-color: transparent;
			/* Not removed via appearance */
			margin: 0;

			font: inherit;
			color: currentColor;
			width: 1.15em;
			height: 1.15em;
			border: 0.15em solid currentColor;
			border-radius: 0.15em;
			transform: translateY(-0.075em);

			display: grid;
			place-content: center;
		}
		input[type="checkbox"]::before {
			content: "";
			width: 0.65em;
			height: 0.65em;
			clip-path: polygon(14% 44%, 0 65%, 50% 100%, 100% 16%, 80% 0%, 43% 62%);
			transform: scale(0);
			transform-origin: center;
			transition: 120ms transform ease-out;
			box-shadow: inset 1em 1em currentColor;
			/* Windows High Contrast Mode */
			background-color: CanvasText;
		}
		input[type="checkbox"]:checked::before {
			transform: scale(1);
		}
		input[type="checkbox"]:focus-visible {
			outline: max(2px, 0.15em) solid currentColor;
			outline-offset: max(2px, 0.15em);
		}
		input[type="checkbox"]:disabled {
			opacity: 50%;
			cursor: not-allowed;
		}
		`,
	];

}
