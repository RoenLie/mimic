import { html, LitElement } from 'lit';
import { customElement } from 'lit/decorators.js';

import { NodeTree } from '../node-tree.js';


@customElement('mimic-node-tree-demo')
export class NodeTreeDemo extends LitElement {

	public override connectedCallback(): void {
		super.connectedCallback();

		type Obj = { first: number; last: number; children?: Obj[]; };

		const obj: Obj = {
			first:    1,
			last:     2,
			children: [
				{
					first: 3,
					last:  4,
				},
			],
		};

		const tree = NodeTree.fromObject(obj, 'children');

		const unwrapped = NodeTree.unwrap(tree, 'children');
		console.log(unwrapped);
	}

	protected override render() {
		return html`
		hello
		`;
	}

}
