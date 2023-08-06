
export type DirectiveString = string & Record<never, never>;
export type Dynamic<T> = T | Promise<T> | (() => Promise<T>) | (() => T);
