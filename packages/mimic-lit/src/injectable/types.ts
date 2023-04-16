export type PropertyName = string & Record<never, never>;
export type ElementMetadata = {
	async: boolean;
	identifier: string | symbol;
}
