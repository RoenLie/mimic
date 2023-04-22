const $Augmented = Symbol();


export type TreeNode<
	TObj extends Record<keyof any, any>,
	TProp extends keyof any
> = Omit<TObj, TProp>
& { [key in TProp]?: TreeNode<TObj, TProp>[] }
& Node<TObj, TProp, TreeNode<TObj, TProp>>;


export const fromObject = <
	TObj extends Record<keyof any, any>,
	const TProp extends keyof TObj
>(object: TObj, childProp: TProp) => {
	const traverse = (obj: TObj, parent?: TreeNode<TObj, TProp>) => {
		if (obj[$Augmented])
			return obj as unknown as TreeNode<TObj, TProp>;

		const augmented = augment(obj, childProp, parent);

		const children = augmented[childProp] as TObj[] ?? [];
		for (let i = 0; i < children.length; i++) {
			const child = children[i]!;
			const augmentedChild = traverse(child, augmented);
			children.splice(i, 1, augmentedChild as unknown as TObj);
		}

		return augmented;
	};

	return traverse(object);
};


export const fromList = <
	TObj extends Record<keyof any, any>,
	TChildProp extends keyof TObj,
	TIdProp extends keyof TObj,
>(_list: TObj[], _childProp: TChildProp, _idProp: TIdProp) => {
	throw Error('not implemented');
};


export const unwrap = <
	TObj extends TreeNode<Record<keyof any, any>,
	TProp>, TProp extends keyof TObj
>(object: TObj, childProp: TProp) => {
	type Original = ReturnType<TObj['unproxy']>;

	const traverse = (obj: TObj) => {
		if (!(obj as any)[$Augmented])
			return obj as Original;

		const unwrapped = obj.unproxy() as Original;

		const children = (unwrapped[childProp] ?? []) as Original[];
		for (let i = 0; i < children.length; i++) {
			const child = children[i]!;

			const unwrappedChild = traverse(child);
			children.splice(i, 1, unwrappedChild);
		}

		return unwrapped;
	};

	return traverse(object);
};


export const augment = <
	TObj extends object,
	TProp extends keyof any
>(obj: TObj, childProp: TProp, parent?: TreeNode<TObj, TProp>) => {
	const proxy = new Proxy(obj, {
		get(target, p, _receiver) {
			if (p === $Augmented)
				return true;

			if (p in node) {
				const value = node[p as keyof Node<TObj, TProp>];

				if (typeof value === 'function')
					return value.bind(node);

				return value;
			}

			return Reflect.get(target, p, _receiver);
		},
	}) as TreeNode<TObj, TProp>;

	const node = new Node(obj, childProp, proxy, parent);

	return proxy;
};


export class NodeTree {

	public static fromList = fromList;
	public static fromObject = fromObject;
	public static unwrap = unwrap;

}


export class Node<
	TObj extends object,
	TProp extends keyof any,
	TNode extends TreeNode<TObj, TProp> = TreeNode<TObj, TProp>
> {

	public get parent() { return this.#parent; }
	#parent?: TNode;
	#original: TObj;
	#proxy: TNode;
	#childProp: TProp;

	constructor(
		target: TObj,
		childProp: TProp,
		proxy: TNode,
		parent?: TNode,
	) {
		this.#proxy = proxy;
		this.#parent = parent;
		this.#original = target;
		this.#childProp = childProp;
	}

	public get isRoot() {
		return this.parent === undefined;
	}

	public unproxy = () => {
		return this.#original;
	};

	public forEach(fn: (item: TNode) => void) {
		const traverse = (node: TNode) => {
			fn(node);

			for (const childNode of node[this.#childProp] ?? [])
				traverse(childNode as TNode);
		};

		traverse(this.#proxy);
	}

	public find(fn: (item: TNode) => boolean) {
		const traverse = (node: TNode) => {
			if (fn(node))
				return node;

			for (const childNode of node[this.#childProp] ?? []) {
				if (traverse(childNode as TNode))
					return childNode;
			}
		};

		return traverse(this.#proxy);
	}

	public filter(fn: (item: TNode) => boolean) {
		const items: TNode[] = [];

		const traverse = (node: TNode) => {
			if (fn(node))
				items.push(node);

			for (const childNode of node[this.#childProp] ?? [])
				traverse(childNode as TNode);
		};

		traverse(this.#proxy);

		return items;
	}

	public some(fn: (item: TNode) => boolean) {
		return !!this.find(fn);
	}

	public every(fn: (item: TNode) => boolean) {
		let valid = true;

		const traverse = (node: TNode) => {
			if (!fn(node))
				return void (valid = false);

			for (const childNode of node[this.#childProp] ?? [])
				traverse(childNode as TNode);
		};

		traverse(this.#proxy);

		return valid;
	}

	public push(...items: TObj[]) {
		this.#proxy[this.#childProp]
			?.push(...items.map(item => augment(item, this.#childProp, this.#proxy)));

		return this.#proxy[this.#childProp]?.length;
	}

	public unshift(...items: TObj[]) {
		this.#proxy[this.#childProp]
			?.unshift(...items.map(item => augment(item, this.#childProp, this.#proxy)));

		return this.#proxy[this.#childProp]?.length;
	}

	public remove() {
		const siblings = this.#parent?.[this.#childProp];
		if (!siblings?.length)
			return;

		const index = siblings.indexOf(this.#proxy);
		if (index === -1)
			return;

		siblings.splice(index, 1);
		this.#parent = undefined;

		return this.#proxy;
	}

}
