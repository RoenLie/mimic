import { range } from '../array/range.js';
import { sleep } from '../async/sleep.js';


type SudokuCell = {
	id: `y=${ number },x=${ number }`;
	box: SudokuCell[];
	row: SudokuCell[];
	column: SudokuCell[];
	validators: Set<SudokuCell>;
	candidates: Set<number>;
	value: number;
}


export class SudokuSolver {

	protected grid: number[][];
	protected size: number;
	protected blockSize: number;

	protected boxes: SudokuCell[][][] = [];
	protected columns: SudokuCell[][] = [];
	protected rows: SudokuCell[][] = [];
	protected cells: SudokuCell[] = [];
	protected allCandidates: Set<number>;

	// Add weakmaps that hold references to the row/column/box, and a set of exactly which numbers are
	// currently being used.
	// Maybe this can speed up the backtracking?


	constructor(sudoku: number[][] | { sudoku: string; delimiter: string; }) {
		// Check if the input is an array of arrays or an object with 'sudoku' and 'delimiter' properties.
		if (Array.isArray(sudoku)) {
			// If it's an array of arrays, assign it directly to the grid.
			this.grid = sudoku;
		}
		else {
			// If it's an object, split the 'sudoku' string into an array of arrays based on the delimiter.
			this.grid = sudoku.sudoku
				.trim()
				.split('\n')
				.filter(Boolean)
				.map(s => s.split(sudoku.delimiter).map(n => Number(n.trim())));
		}

		// Set the size of the Sudoku grid based on the length of the input.
		this.size = this.grid.length;
		// Calculate the blockSize (the size of each block/region) by finding the square root of the size.
		this.blockSize = Math.sqrt(this.size);

		// Check if the blockSize is an integer, otherwise throw an error.
		if (this.blockSize % 1 != 0)
			throw ('Invalid Sudoku size');

		// Generate a range of numbers from 1 to the size of the Sudoku grid.
		this.allCandidates = new Set(range(1, this.size + 1));

		// Loop through the rows of the grid.
		for (let rowIndex = 0; rowIndex < this.grid.length; rowIndex++) {
			const row = this.grid[rowIndex]!;
			// Loop through the columns of each row.
			for (let colIndex = 0; colIndex < row.length; colIndex++) {
				const col = row[colIndex]!;

				// Initialize a cell object.
				const cell: Partial<SudokuCell> = {
					id:         `y=${ rowIndex },x=${ colIndex }`,
					value:      col,
					candidates: new Set(this.allCandidates),
					validators: new Set<SudokuCell>(),
				};

				// Add the cell to the corresponding column.
				this.columns[colIndex] ??= [];
				this.columns[colIndex]![rowIndex] = cell as SudokuCell;

				// Add the cell to the corresponding row.
				this.rows[rowIndex] ??= [];
				this.rows[rowIndex]![colIndex] = cell as SudokuCell;

				// Assign row and column references to the cell.
				cell.row = this.rows[rowIndex];
				cell.column = this.columns[colIndex];

				// Add the cell to the cells Map.
				this.cells.push(cell as SudokuCell);

				// Calculate the block indices
				const blockRow = Math.floor(rowIndex / this.blockSize);
				const blockCol = Math.floor(colIndex / this.blockSize);

				this.boxes[blockRow] ??= [];
				this.boxes[blockRow]![blockCol] ??= [];
				this.boxes[blockRow]![blockCol]!.push(cell as SudokuCell);

				// Assign the box reference to the cell.
				cell.box = this.boxes[blockRow]![blockCol];
			}
		}

		this.cells.forEach(cell => {
			cell.box.forEach(c => cell.validators.add(c));
			cell.row.forEach(c => cell.validators.add(c));
			cell.column.forEach(c => cell.validators.add(c));
		});
	}

	public removeInvalidCandidates() {
		for (let cell of this.cells)
			cell.validators.forEach(c => cell.candidates.delete(c.value));
	}

	//private isValidCandidate(cell: SudokuCell, candidate: number): boolean {
	//	// Check if the candidate is valid in the row, column, and box
	//	return (
	//		!cell.row.some(c => c.value === candidate) &&
	//		!cell.column.some(c => c.value === candidate) &&
	//		!cell.box.some(c => c.value === candidate)
	//	);
	//}

	//public findEmptyCell() {
	//	const cell = this.cells.find(c => !c.value);
	//	if (!cell)
	//		return {};

	//	const candidates = new Set<number>(cell.candidates);
	//	cell?.box.forEach(c => candidates.delete(c.value));
	//	cell?.row.forEach(c => candidates.delete(c.value));
	//	cell?.column.forEach(c => candidates.delete(c.value));

	//	return { cell, candidates };
	//}

	//public bruteForce(): boolean {
	//	type CellWithCandidates = {
	//		cell: SudokuCell;
	//		candidates: Set<number>;
	//	};

	//	const stack: CellWithCandidates[] = [];

	//	// Initialize the stack with the first empty cell
	//	let nextEmptyCell = this.findEmptyCell();
	//	if (nextEmptyCell.cell)
	//		stack.push(nextEmptyCell);


	//	while (stack.length > 0) {
	//		const current = stack[stack.length - 1]!;

	//		// If there are no candidates for the current cell, backtrack by popping the stack
	//		if (current.candidates.size === 0) {
	//			current.cell.value = 0;
	//			stack.pop();
	//			continue;
	//		}

	//		// Get and remove the next candidate
	//		const candidate = current.candidates.values().next().value;
	//		current.candidates.delete(candidate);

	//		// Check if the candidate is valid for the current cell
	//		if (this.isValidCandidate(current.cell, candidate)) {
	//			// Set the candidate as the value of the current cell
	//			current.cell.value = candidate;

	//			// Find the next empty cell
	//			nextEmptyCell = this.findEmptyCell();

	//			if (!nextEmptyCell.cell) {
	//				// If there are no more empty cells, the puzzle is solved
	//				return true;
	//			}
	//			else {
	//				// Push the next empty cell onto the stack
	//				stack.push(nextEmptyCell);
	//			}
	//		}
	//	}

	//	return false;
	//}


	public findEmptyCell() {
		const cell = this.cells.find(c => !c.value);
		if (!cell)
			return {};

		const candidates = new Set<number>(cell.candidates);
		cell?.validators.forEach(c => candidates.delete(c.value));

		return { cell, candidates };
	}

	public bruteForce() {
		const { cell, candidates } = this.findEmptyCell() ?? {};
		if (!cell)
			return true;

		for (const candidate of candidates) {
			cell.value = candidate;

			if (this.bruteForce())
				return true;

			cell.value = 0;
		}

		return false;
	}

	public printCells() {
		const tbl: string[][] = [];

		this.cells.forEach(cell => {
			const x = parseInt(/x=(\d+)/.exec(cell.id)![1]!);
			const y = parseInt(/y=(\d+)/.exec(cell.id)![1]!);

			tbl[y] ??= [];
			tbl[y]![x] = `${ cell.value }`;
		});

		console.table(tbl);
	}


	public solve() {
		this.removeInvalidCandidates();
		this.bruteForce();

		this.printCells();

		return;
	}

}


const findSetDifference = (allNumbers: Set<number>, invalidNumbers: Set<number>) => {
	const validNumbers = new Set<number>();

	for (const num of allNumbers) {
		if (!invalidNumbers.has(num))
			validNumbers.add(num);
	}

	return validNumbers;
};
