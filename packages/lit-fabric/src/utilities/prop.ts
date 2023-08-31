export class Prop<T = any> {

	public static bind(obj: Prop, name: string, ref: Record<keyof any, any>) {
		obj.#name = name;
		obj.#ref = new WeakRef(ref);
		obj.setter(obj.#initial);
	}

	#name: string;
	#ref?: WeakRef<Record<keyof any, any>>;
	#initial: T;

	constructor(initialValue: any) {
		this.#initial = initialValue;
	}

	public getter() {
		const prox = new Proxy<{value: T}>({ value: undefined as any }, {
			get: () => {
				const ref = this.#ref?.deref();

				return ref?.[this.#name] ?? this.#initial;
			},
		});

		return prox;
	}

	public setter = (value: T) => {
		const ref = this.#ref?.deref();
		if (ref)
			ref[this.#name] = value;
		else
			this.#initial = value;
	};

}
