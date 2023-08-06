export type Dynamic<T> = T | Promise<T> | (() => Promise<T>) | (() => T);
