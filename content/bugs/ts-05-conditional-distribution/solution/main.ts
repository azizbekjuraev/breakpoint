export type ToArray<T> = [T] extends [unknown] ? T[] : never;
