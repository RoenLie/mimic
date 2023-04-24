import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { range } from '../../utils/array/range.js';
import { NodeTree } from '../node-tree.js';


@customElement('mimic-node-tree-demo')
export class NodeTreeDemo extends LitElement {

	public override connectedCallback(): void {
		super.connectedCallback();


		const createNestedObject = (depth: number, children: number) => {
			let incr = 0;

			const create = (depth: number, children: number) => {
				type Obj = { id: number; children?: Obj[]; };
				const obj: Obj = { id: incr };
				incr++;

				if (depth)
					obj.children = range(0, children).map(() => create(depth - 1, children));

				return obj;
			};

			return create(depth, children);
		};

		const root1 = createNestedObject(5, 2);
		const root2 = createNestedObject(5, 2);
		const root3 = createNestedObject(5, 2);

		const tree1 = NodeTree.fromObject([ root1, root2, root3 ], 'children');
		const tree2 = NodeTree.fromObject(root1, 'children');

		tree1.forEach(item => item.id);
		//console.log(tree1);
		//console.log(tree2);

		//const filtered = tree2.filter(item => item.id === 1);
		//console.log(filtered);

		//const validated = tree2.every(item => typeof item.id === 'number');
		//console.log(validated);

		//const validated = tree2.some(item => item.id === 5);
		//console.log(validated);

		//tree2.forEach(item => {
		//	if (item.isRoot) {
		//		item.push({
		//			id: 696969,
		//		});
		//	}
		//});

		//console.log(tree2);


		type ListItem = {id: number; parent?: number;};

		const items: ListItem[] = [
			{ id: 1, parent: undefined },
			{ id: 2, parent: 1 },
			{ id: 3, parent: 1 },
			{ id: 4, parent: 2 },
		];

		const fromList = NodeTree.fromList(items, 'id', 'parent', 'children');
		//console.log(fromList);

		//console.log(fromList.forEach(item => item.children));


		//const tree = NodeTree.fromObject(root1, 'children');
		//const multiRootTree = NodeTree.fromObject([ root1, root2, root3 ], 'children');
		//console.log(multiRootTree);


		//console.log(tree);

		//const unwrapped = NodeTree.unwrap(tree, 'children');
		//console.log(unwrapped);
	}

	protected override render() {
		return html`
		hello
		`;
	}

}


type ObjTree = { id: number; children?: ObjTree[] };

const demoObject: ObjTree = {
	id:       1,
	children: [
		{
			id:       2,
			children: [
				{
					id:       3,
					children: [
						{
							id:       4,
							children: [
								{ id: 5 },
								{ id: 6 },
								{ id: 7 },
							],
						},
						{
							id:       8,
							children: [
								{ id: 9 },
								{ id: 10 },
								{ id: 11 },
								{ id: 12 },
							],
						},
						{
							id:       13,
							children: [
								{ id: 14 },
								{ id: 15 },
								{ id: 16 },
							],
						},
					],
				},
				{
					id:       17,
					children: [
						{
							id:       18,
							children: [
								{ id: 19 },
								{ id: 20 },
								{ id: 21 },
								{ id: 22 },
								{ id: 23 },
							],
						},
						{
							id:       24,
							children: [
								{ id: 25 },
								{ id: 26 },
								{ id: 27 },
							],
						},
						{
							id:       28,
							children: [
								{ id: 29 },
								{ id: 30 },
								{ id: 31 },
								{ id: 32 },
							],
						},
					],
				},
				{
					id:       33,
					children: [
						{
							id:       34,
							children: [
								{ id: 35 },
								{ id: 36 },
								{ id: 37 },
							],
						},
						{
							id:       38,
							children: [
								{ id: 39 },
								{ id: 40 },
								{ id: 41 },
								{ id: 42 },
							],
						},
						{
							id:       43,
							children: [
								{ id: 44 },
								{ id: 45 },
								{ id: 46 },
								{ id: 47 },
								{ id: 48 },
							],
						},
					],
				},
			],
		},
		{
			id:       49,
			children: [
				{
					id:       50,
					children: [
						{
							id:       51,
							children: [
								{ id: 52 },
								{ id: 53 },
								{ id: 54 },
							],
						},
						{
							id:       55,
							children: [
								{ id: 56 },
								{ id: 57 },
								{ id: 58 },
								{ id: 59 },
							],
						},
						{
							id:       60,
							children: [
								{ id: 61 },
								{ id: 62 },
								{ id: 63 },
								{ id: 64 },
								{ id: 65 },
							],
						},
					],
				},
				{
					id:       66,
					children: [
						{
							id:       67,
							children: [
								{ id: 68 },
								{ id: 69 },
								{ id: 70 },
							],
						},
						{
							id:       71,
							children: [
								{ id: 72 },
								{ id: 73 },
								{ id: 74 },
								{ id: 75 },
							],
						},
						{
							id:       76,
							children: [
								{ id: 77 },
								{ id: 78 },
								{ id: 79 },
								{ id: 80 },
							],
						},
					],
				},
				{
					id:       81,
					children: [
						{
							id:       82,
							children: [
								{ id: 83 },
								{ id: 84 },
								{ id: 85 },
							],
						},
						{
							id:       86,
							children: [
								{ id: 87 },
								{ id: 88 },
								{ id: 89 },
								{ id: 90 },
							],
						},
						{
							id:       91,
							children: [
								{ id: 92 },
								{ id: 93 },
								{ id: 94 },
								{ id: 95 },
							],
						},
					],
				},
			],
		},
	],
};
