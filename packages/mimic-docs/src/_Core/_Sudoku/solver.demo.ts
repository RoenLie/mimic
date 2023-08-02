import { clone } from '@roenlie/mimic-core/structs';
import { type Change, SudokuSolver } from '@roenlie/mimic-core/sudoku';
import { css, html, LitElement, nothing } from 'lit';
import { customElement } from 'lit/decorators.js';
import { classMap } from 'lit/directives/class-map.js';
import { repeat } from 'lit/directives/repeat.js';


@customElement('mimic-solver-demo')
export class SolverDemoElement extends LitElement {

	protected small = `
	0 0 2 3 6 0 0 0 0
	0 0 0 4 5 0 9 6 0
	0 0 4 0 0 0 0 0 5
	0 0 0 0 0 0 0 2 8
	0 0 0 0 0 8 1 5 0
	3 0 0 0 0 0 0 0 0
	2 0 0 0 0 1 0 0 7
	0 0 0 9 8 3 0 0 0
	4 1 0 0 0 5 0 0 0
	`;

	protected '16x16' = `
	0 6 0 0 0 0 0 8 11 0 0 15 14 0 0 16
	15 11 0 0 0 16 14 0 0 0 12 0 0 6 0 0
	13 0 9 12 0 0 0 0 3 16 14 0 15 11 10 0
	2 0 16 0 11 0 15 10 1 0 0 0 0 0 0 0
	0 15 11 10 0 0 16 2 13 8 9 12 0 0 0 0
	12 13 0 0 4 1 5 6 2 3 0 0 0 0 11 10
	5 0 6 1 12 0 9 0 15 11 10 7 16 0 0 3
	0 2 0 0 0 10 0 11 6 0 5 0 0 13 0 9
	10 7 15 11 16 0 0 0 12 13 0 0 0 0 0 6
	9 0 0 0 0 0 1 0 0 2 0 16 10 0 0 11
	1 0 4 6 9 13 0 0 7 0 11 0 3 16 0 0
	16 14 0 0 7 0 10 15 4 6 1 0 0 0 13 8
	11 10 0 15 0 0 0 16 9 12 13 0 0 1 5 4
	0 0 12 0 1 4 6 0 16 0 0 0 11 10 0 0
	0 0 5 0 8 12 13 0 10 0 0 11 2 0 0 14
	3 16 0 0 10 0 0 7 0 0 6 0 0 0 12 0
	`;

	protected medium = `
	0 0 12 6 0 0 7 0 18 0 5 24 0 10 1 0 0 4 0 0 0 0 0 0 0
	2 0 19 0 13 0 0 0 10 0 0 0 0 0 0 0 0 18 5 0 0 0 0 0 1
	0 0 0 0 0 0 0 22 0 0 0 0 3 0 2 0 0 14 12 0 16 8 25 0 0
	0 16 0 0 0 2 23 0 0 13 12 22 0 0 0 21 15 19 3 0 0 0 0 14 0
	23 0 24 0 0 0 0 0 25 8 4 0 16 19 21 0 0 7 0 0 0 3 12 0 9
	0 4 0 2 0 0 0 0 0 0 0 10 0 24 12 17 16 0 0 0 5 0 0 0 0
	0 0 9 0 0 6 25 0 0 0 8 0 5 3 0 0 0 0 0 0 20 0 0 18 19
	15 0 10 11 0 0 0 18 12 19 0 0 0 0 0 0 0 23 0 0 7 0 0 4 0
	0 0 0 0 0 0 0 14 0 22 0 0 18 16 20 0 6 11 13 0 0 0 0 0 0
	0 22 0 25 0 0 1 17 5 4 7 0 0 14 0 8 3 21 0 0 11 0 0 0 6
	0 20 13 15 0 0 0 0 0 0 9 0 0 2 0 25 0 1 8 0 0 5 0 21 0
	0 1 0 0 0 0 16 10 0 7 0 0 4 20 0 0 9 0 0 14 0 24 0 17 0
	25 2 5 0 0 0 0 0 13 0 0 0 0 0 22 0 0 0 0 0 19 1 8 0 0
	0 0 7 21 0 0 12 0 2 17 0 0 0 18 6 16 0 0 15 0 0 13 0 10 0
	8 10 18 12 16 9 0 0 0 5 0 0 0 0 19 0 0 17 0 21 0 15 0 0 22
	0 8 0 0 15 0 3 0 6 0 21 0 0 7 0 18 14 5 0 1 0 0 0 0 0
	0 0 0 19 0 1 0 16 11 0 0 0 10 22 25 15 0 0 0 0 0 0 21 0 0
	0 3 1 0 21 0 0 4 0 0 0 0 2 0 13 0 24 25 0 0 14 0 0 6 0
	0 0 0 0 0 0 0 15 0 12 14 0 6 17 24 0 0 0 0 0 0 0 13 0 0
	0 5 23 16 4 0 13 24 7 2 0 9 0 0 15 3 0 22 0 0 0 0 0 0 8
	0 0 25 20 2 0 19 0 0 0 0 1 0 0 0 0 21 3 0 0 12 0 0 0 0
	16 12 0 5 0 11 21 0 23 0 0 15 0 0 0 0 19 9 0 0 0 0 0 25 10
	0 0 0 0 9 20 22 7 4 0 3 0 14 25 18 0 11 0 0 0 0 0 1 0 15
	24 0 6 0 22 8 0 25 14 0 10 11 0 9 0 20 1 16 0 7 0 23 0 0 13
	14 13 21 1 0 0 5 0 0 0 6 0 22 0 23 10 0 0 0 2 0 0 18 7 11
	`;

	protected large = `
	0 0 0 0 0 34 0 36 4 8 0 24 33 13 7 26 32 0 0 35 23 30 14 17 10 0 12 27 1 0 25 0 0 0 0 0
	0 0 0 0 0 11 0 0 3 6 17 20 27 30 0 15 14 18 32 19 16 0 36 33 24 9 5 4 0 0 10 0 0 0 0 0
	0 0 0 0 0 0 13 0 12 27 31 21 0 5 6 0 0 10 11 0 0 1 3 0 19 34 25 32 0 26 0 0 0 0 0 0
	0 0 0 0 0 0 0 0 14 0 0 0 0 0 28 9 0 0 0 0 15 26 0 0 0 0 0 30 0 0 0 0 0 0 0 0
	0 0 0 0 0 0 9 11 7 16 26 32 8 23 24 35 1 31 6 21 28 4 5 34 29 14 33 17 13 3 0 0 0 0 0 0
	0 0 0 0 0 14 1 0 0 0 0 34 19 22 21 29 0 0 0 0 31 10 12 7 6 0 0 0 0 18 3 0 0 0 0 0
	0 0 0 0 24 1 0 0 11 22 0 0 35 10 2 0 0 7 15 0 0 25 6 5 0 0 3 14 0 0 32 12 0 0 0 0
	25 5 0 13 34 0 0 4 27 35 32 0 0 11 0 0 12 1 7 29 0 0 23 0 0 30 20 9 31 0 0 10 6 0 18 16
	7 4 10 36 0 0 6 12 25 15 8 3 0 0 0 20 27 21 28 18 30 0 0 0 11 16 17 19 5 2 0 0 35 1 34 31
	6 2 14 0 0 0 23 17 21 1 28 9 0 0 0 34 19 22 12 26 27 0 0 0 36 24 32 10 7 13 0 0 0 3 11 4
	17 3 0 0 9 0 0 7 13 34 5 0 0 32 0 0 4 33 24 10 0 0 20 0 0 12 22 1 18 0 0 25 0 0 23 14
	32 0 0 31 11 8 0 0 30 26 0 0 5 29 23 0 0 13 1 0 0 9 17 19 0 0 35 33 0 0 15 28 27 0 0 21
	0 0 8 18 28 12 35 0 0 0 0 29 24 14 20 4 0 0 0 0 5 33 31 6 7 0 0 0 0 25 21 9 3 27 0 0
	0 11 13 14 4 3 34 25 0 0 7 15 18 27 22 21 2 0 0 28 1 19 8 12 17 10 0 0 35 24 6 30 31 23 26 0
	0 0 6 5 15 27 8 0 0 0 0 10 16 1 30 28 0 0 0 0 34 24 25 9 22 0 0 0 0 31 17 18 7 33 0 0
	31 0 0 24 2 17 0 0 20 28 0 0 34 6 29 0 0 32 23 0 0 15 13 22 0 0 8 18 0 0 35 4 12 0 0 11
	9 1 0 0 32 0 0 27 24 12 6 0 0 8 0 0 31 26 35 11 0 0 7 0 0 13 23 29 34 0 0 15 0 0 2 28
	35 25 23 0 0 0 4 14 31 11 18 16 0 0 0 7 15 17 26 27 32 0 0 0 33 3 1 28 9 6 0 0 0 20 24 8
	24 34 28 0 0 0 27 5 10 4 3 8 0 0 0 16 26 2 22 32 7 0 0 0 12 18 6 21 36 17 0 0 0 29 20 9
	20 18 0 0 14 0 0 33 35 9 24 0 0 21 0 0 10 5 31 23 0 0 19 0 0 15 29 22 25 0 0 16 0 0 13 27
	27 0 0 22 26 6 0 0 17 20 0 0 23 28 18 0 0 14 16 0 0 35 4 25 0 0 34 7 0 0 2 21 5 0 0 15
	0 0 15 8 5 16 31 0 0 0 0 28 32 7 33 22 0 0 0 0 24 34 27 20 14 0 0 0 0 11 1 3 17 12 0 0
	0 35 29 2 12 19 16 23 0 0 22 13 31 4 3 11 34 0 0 15 18 17 21 26 9 20 0 0 33 30 14 6 24 25 8 0
	0 0 3 25 17 32 12 0 0 0 0 11 36 24 1 6 0 0 0 0 33 28 30 2 16 0 0 0 0 35 31 7 4 19 0 0
	36 0 0 6 1 30 0 0 34 13 0 0 10 20 35 0 0 29 9 0 0 7 2 23 0 0 14 8 0 0 18 24 11 0 0 12
	14 22 0 0 35 0 0 2 29 24 15 0 0 34 0 0 23 28 21 6 0 0 32 0 0 26 18 25 3 0 0 1 0 0 27 5
	19 16 26 0 0 0 3 8 18 17 12 4 0 0 0 14 33 15 5 24 35 0 0 0 2 28 7 23 32 22 0 0 0 6 30 25
	18 27 24 15 0 0 26 32 9 5 36 14 0 0 0 17 30 6 34 8 12 0 0 0 13 31 21 35 19 33 0 0 10 22 4 3
	3 21 0 12 8 0 0 35 23 10 20 0 0 18 0 0 24 4 19 22 0 0 15 0 0 6 11 36 29 0 0 31 33 0 17 2
	0 0 0 0 31 23 0 0 16 25 0 0 22 26 27 0 0 8 14 0 0 3 18 4 0 0 24 34 0 0 7 32 0 0 0 0
	0 0 0 0 0 28 18 0 0 0 0 5 20 35 8 32 0 0 0 0 17 23 9 21 34 0 0 0 0 16 11 0 0 0 0 0
	0 0 0 0 0 0 17 22 33 29 1 12 26 31 9 23 28 19 13 3 11 6 34 32 27 25 30 24 14 7 0 0 0 0 0 0
	0 0 0 0 0 0 0 0 8 0 0 0 0 0 36 10 0 0 0 0 29 14 0 0 0 0 0 12 0 0 0 0 0 0 0 0
	0 0 0 0 0 0 15 0 19 3 16 27 0 17 4 0 0 30 25 0 0 18 35 0 32 23 10 11 0 36 0 0 0 0 0 0
	0 0 0 0 0 26 0 0 36 23 14 25 29 3 0 18 21 34 27 31 19 0 10 28 8 2 15 6 0 0 9 0 0 0 0 0
	0 0 0 0 0 36 0 34 32 30 0 35 11 15 14 27 22 0 0 1 20 12 26 16 5 0 13 3 4 0 8 0 0 0 0 0
	`;

	protected solver = new SudokuSolver({
		sudoku:    this['16x16'],
		delimiter: ' ',
	});

	protected lastCellId: string | undefined;
	protected grid: number[][] = [];
	protected candidates: number[][][] = [];
	protected playing = false;
	protected lastChangeIndex = 0;

	public override connectedCallback() {
		super.connectedCallback();

		requestIdleCallback(async () => {
			const start = performance.now();
			this.solver.solve();
			console.log(performance.now() - start);

			console.log(this.solver.output);

			this.grid = clone(this.solver.output.grid);
			this.candidates = clone(this.solver.output.candidates);
			this.requestUpdate();

			this.play();
		});
	}

	protected applyChange(change: Change) {
		if (change.type === 'assignment')
			this.grid[change.y]![change.x] = change.value;

		if (change.type === 'candidate') {
			let index = this.candidates[change.y]![change.x]?.indexOf(change.value) ?? -1;
			if (index > -1)
				this.candidates[change.y]![change.x]!.splice(index, 1);
		}

		this.lastCellId = '' + change.y + change.x;
	}

	public async play() {
		this.playing = true;

		while (this.playing) {
			//if (this.lastChangeIndex > 330)
			//	await sleep(100);

			const change = this.solver.output.changes[this.lastChangeIndex];
			if (change) {
				this.applyChange(change);
				this.lastChangeIndex++;
				this.requestUpdate();
			}
			else {
				this.playing = false;
			}
		}
	}

	protected override render() {
		return html`
		<div class="base">
			${ repeat(this.grid, row => row, (row, rowIndex) => html`
			<div class="row">
				${ repeat(row, cell => cell, (value, columnIndex) => {
					let xMod = Math.ceil((columnIndex + 1) % this.solver.blockSize);
					let yMod = Math.ceil((rowIndex + 1) % this.solver.blockSize);
					const candidates = this.candidates[rowIndex]![columnIndex]!;

					return html`
					<div
						x=${ columnIndex }
						y=${ rowIndex }
						class=${ classMap({
							column:       true,
							active:       '' + rowIndex + columnIndex === this.lastCellId,
							'left-edge':  columnIndex !== 0 && xMod === 1,
							'right-edge': columnIndex !== this.solver.size - 1 && xMod === 0,
							'top-edge':   rowIndex !== 0 && yMod === 1,
							'bot-edge':   rowIndex !== this.solver.size - 1 && yMod === 0,
						}) }
					>
						${ repeat(candidates, c => c, (can, canIndex) => html`
						${ canIndex === this.solver.blockSize
							? nothing : html`
							<div style="font-size: 8px;">${ can }</div>
							` }
						`) }

						<div style="grid-row:2/3;grid-column:2/3;">
							${ value || nothing }
						</div>
					</div>
					`;
				}) }
			</div>
			`) }
		</div>
		`;
	}

	public static override styles = [
		css`
		:host {
			display: grid;
			width: max-content;
			box-shadow: 0px 0px 1px 2px white;
			border-radius: 4px;
		}
		* {
			box-sizing: border-box;
		}
		.base {
			display: grid;
			border: 1px solid black;
			border-radius: inherit;
			background-color: oldlace;
			color: black;
		}
		.row {
			display: grid;
			grid-auto-flow: column;
			border-bottom: 1px solid black;
		}
		.row:last-of-type {
			border-bottom: none;
		}
		.column {
			position: relative;
			width: 50px;
			height: 50px;
			display: grid;
			place-items: center;
			border-right: 1px solid black;

			grid-template-columns: 1fr 1fr 1fr;
			grid-template-rows: 1fr 1fr 1fr;
		}
		/*.column::before {
			content:'x:' attr(x) ' y:' attr(y);
			position: absolute;
			top: 0;
			left: 0;
			font-size: 8px;
		}*/
		.column:last-of-type {
			border-right: none;
		}
		.column.active {
			background-color: maroon;
			color: white;
		}
		.column div {
			line-height: 1em;
		}
		.left-edge {
			border-left: 2px solid black;
		}
		.right-edge {
			border-right: 2px solid black;
		}
		.top-edge {
			border-top: 2px solid black;
		}
		.bot-edge {
			border-bottom: 2px solid black;
		}
		`,
	];

}
