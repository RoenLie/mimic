type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type LastOf<T> = UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never
type Push<T extends any[], V> = [...T, V];
export type UnionToTuple<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
  true extends N ? [] : Push<UnionToTuple<Exclude<T, L>>, L>

//type abc = 'a' | 'b' | 'c';
//type t = UnionToTuple<abc>; // ["a", "b", "c"]
