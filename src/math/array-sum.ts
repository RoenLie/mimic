/**
 * Returns the sum of all numbers in an array of numbers.
 */
export const arraySum = (arr: (number | null | undefined)[]) => arr.reduce((acc: number, cur) => acc += cur ?? 0, 0);
