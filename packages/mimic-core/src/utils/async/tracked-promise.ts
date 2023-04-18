import { nanoid } from 'nanoid';


export interface ITrackedPromise<T> extends Promise<T> {
	id: string;
	done: boolean;
	resolve: (value?: T) => void;
	reject: () => void;
}

export type ITrackedPromiseConstructor = {
	new<T>(executor: (
		resolve: (value: T) => void,
		reject:  (reason?: any) => void
	) => void): ITrackedPromise<T>;

	resolve<T>(value: T): ITrackedPromise<T>;
	resolve<T>(): ITrackedPromise<T>;
};


export const TrackedPromise = function<T>(
	this: ITrackedPromise<T>,
	executor: ConstructorParameters<PromiseConstructorLike>[0],
) {
	let id = nanoid(5);
	let resolver: (value?: any) => void = () => {};
	let rejector: () => void = () => {};

	const promise = new Promise<T>((resolve, reject) => {
		resolver = (value: T) => {
			this.done = true;
			resolve(value);
		};

		rejector = (reason?: any) => {
			this.done = true;
			reject(reason);
		};
	});

	Object.assign(promise, {
		id,
		done:    false,
		resolve: resolver,
		reject:  rejector,
	});

	executor(resolver, rejector);

	return promise;
} as unknown as ITrackedPromiseConstructor;


TrackedPromise.resolve = <T>(value?: T) => {
	let promise = new TrackedPromise<T>(() => {});
	promise.resolve(value);

	return promise;
};
