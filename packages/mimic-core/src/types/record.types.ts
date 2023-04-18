/**
 * Makes T indexable.
 *
 * Constraints on key types and value can be supplies
 * as second and third parameters respectively.
 */
export type RecordOf<T extends object = object, TK extends keyof any = keyof any, TV = any> = T & Record<TK, TV>;


/**
 * Union of the type of all keys of `T`.
 */
export type ValueOf<T> = T[keyof T];
