import { readPath } from '@roenlie/mimic-core/structs';
import { throttle, withDebounce } from '@roenlie/mimic-core/timing';
import { css, html, nothing, type ReactiveController } from 'lit';
import { map } from 'lit/directives/map.js';
import { createRef, type Ref, ref } from 'lit/directives/ref.js';
import { when } from 'lit/directives/when.js';

import { DynamicStyle } from '../../utilities/dynamic-styles.js';
import type { FragmentTable } from './fragment-table.js';
import { intersect } from './intersect-directive.js';


export class RowRenderController implements ReactiveController {

	public readonly rowOverflow = 10;
	public topBufferRange = 0;
	public botBufferRange = 0;
	public dataRange: Record<string, any>[] = [];
	public interObs: Promise<IntersectionObserver>;
	public firstRowFirstCell: Ref<HTMLTableCellElement> = createRef();

	protected get table() {
		return this.host.shadowRoot?.getElementById('table');
	}

	public get rowHeight() {
		return parseInt(getComputedStyle(this.host).getPropertyValue('--_row-height'));
	}

	public get visibleRows() {
		const rowCount = Math.floor(this.host.getBoundingClientRect().height / this.rowHeight);

		return rowCount;
	}

	public get currentRow() {
		return Math.floor((this.table?.scrollTop ?? 0) / this.rowHeight);
	}

	#dynamicStyle = new DynamicStyle();
	public get dynamicStyling() {
		this.#dynamicStyle.clear();

		const rowHighlightProp = this.topBufferRange % 2 === 0
			? '--_initial-even' : '--_initial-odd';

		this.#dynamicStyle.selector('table')
			.property(rowHighlightProp, 'var(--_row-even-background)')
			.property('--_top-buffer-height', (this.topBufferRange * this.rowHeight) + 'px')
			.property('--_bot-buffer-height', (this.botBufferRange * this.rowHeight) + 'px');

		return this.#dynamicStyle.toString();
	}

	constructor(protected host: FragmentTable) {
		host.addController(this);
	}

	public hostConnected() {
		this.interObs = this.host.updateComplete.then(() => {
			return new IntersectionObserver((entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting)
						continue;

					if (entry.target.id === 'top-buffer' && this.topBufferRange === 0)
						continue;
					if (entry.target.id === 'bot-buffer' && this.botBufferRange === 0)
						continue;

					this.updateDisplayedData();
				}
			}, {
				root: this.table,
			});
		});
	}

	public hostAfterConnected() {
		this.table?.addEventListener('scroll', this.handleTableScroll, { passive: true });
		this.updateDisplayedData();
	}

	public hostDisconnected() {
		this.table?.removeEventListener('scroll', this.handleTableScroll);
		this.interObs.then(obs => obs?.disconnect());
	}

	protected updateTopBufferRange() {
		const topBufferEnd = Math.max(0, this.currentRow - this.rowOverflow);

		this.topBufferRange = topBufferEnd;
	}

	protected updateBotBufferRange() {
		// We add +1 because we also add +1 on the end of the data range.
		let dataEndIndex = this.currentRow + 1 + this.visibleRows + this.rowOverflow;
		dataEndIndex = Math.min(dataEndIndex, this.host.data.length);

		const remainingLength = this.host.data.length - dataEndIndex;

		this.botBufferRange = Math.max(0, remainingLength);
	}

	protected updateDataRange() {
		const dataStartIndex = Math.max(0, this.currentRow - this.rowOverflow);
		// We add +1 so that it doesn't swap which rows are even and odd.
		let dataEndIndex = this.currentRow + this.visibleRows + this.rowOverflow + 1;
		dataEndIndex = Math.min(dataEndIndex, this.host.data.length);

		this.dataRange.length = 0;
		for (let i = dataStartIndex; i < dataEndIndex; i++) {
			const item = this.host.data[i];
			if (item)
				this.dataRange.push(item);
		}
	}

	public updateDisplayedData() {
		const previousTopBuffer = this.topBufferRange;

		this.updateTopBufferRange();
		this.updateBotBufferRange();
		this.updateDataRange();

		const newTopBuffer = this.topBufferRange;
		const difference = newTopBuffer - previousTopBuffer;
		const scrollDiff = difference * this.rowHeight;
		this.table!.scrollTop -= scrollDiff;

		this.host.requestUpdate();
	}

	protected handleTableScroll = (() => {
		const ids = [ 'top-buffer', 'bot-buffer' ];
		const elements: Element[] = [];

		const func = () => {
			const root = this.host.shadowRoot!;
			const { top, bottom, left, width } = this.table!.getBoundingClientRect();
			const centerX = (width / 2) + left;

			const topPos = Math.max(0, top + this.rowHeight * 2);
			const topEl = root.elementFromPoint(centerX, topPos);
			const botPos = Math.max(0, bottom - this.rowHeight * 2);
			const botEl = root.elementFromPoint(centerX, botPos);

			elements.length = 0;
			if (topEl)
				elements.push(topEl);
			if (botEl)
				elements.push(botEl);

			if (elements.some(el => ids.includes(el.id)))
				this.updateDisplayedData();
		};

		return withDebounce(throttle(func, 25), func, 100);
	})();

	public DynamicStyles() {
		return html`
		<style>${ this.dynamicStyling }</style>
		`;
	}

	public Rows() {
		return html`
		<tr id="top-buffer" ${ intersect(this.interObs) }></tr>
		${ map(this.dataRange, (data, i) => this.Row(data, i)) }
		<tr id="bot-buffer" ${ intersect(this.interObs) }></tr>
		`;
	}

	protected Row(data: Record<string, any>, index: number) {
		return html`
		<tr id=${ 'row-' + index } part="tbody-tr">
			<td ${ ref(this.firstRowFirstCell) }>
				${ when(this.host.options?.checkbox, () => html`
				<input data-row-index=${ index } type="checkbox" />
				`) }
			</td>
			${ map(Object.entries(data), (_, i) => {
				const column = this.host.columns[i];
				if (!column)
					return nothing;

				let template: unknown = nothing;
				if (column.fieldRender)
					template = column.fieldRender?.(data);
				else if (column.field)
					template = html`<span>${ readPath(data, column.field) }</span>`;

				return html`<td part="td">${ template }</td>`;
			}) }
			<td></td>
		</tr>
		`;
	}

	public static styles = css`
		tr {
			display: grid;
			grid-template-columns: var(--_template-columns);
			height: var(--_row-height);
			content-visibility: auto; /* Used for performance */
			contain-intrinsic-size: var(--_row-height); /* Used for performance */
		}
		tr#top-buffer {
			all: unset;
			height: var(--_top-buffer-height);
		}
		tr#bot-buffer {
			all: unset;
			height: var(--_bot-buffer-height);
		}

		tbody tr {
			background-color: var(--_row-background);
			border-bottom: var(--_row-bottom-border);
		}
		tbody tr:nth-of-type(odd) {
			background-color: var(--_initial-odd);
		}
		tbody tr:nth-of-type(even) {
			background-color: var(--_initial-even);
		}
		tbody tr:hover {
			background-color: var(--_row-background-hover);
		}
	`;

}
