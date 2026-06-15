## Hint 1

Hover `ToArray<string | number>` in your head: you'd hope for `(string | number)[]`. What TypeScript actually computes is `string[] | number[]` — that's the distributive conditional kicking in because `T` is a bare type parameter on the left of `extends`.

## Hint 2

Wrap both sides of the `extends` in single-element tuples. That stops `T` from being "naked" and stops the distribution.

```ts
export type ToArray<T> = [T] extends [unknown] ? T[] : never;
```

Same shape, same intent, but now it produces one combined array type for a union input.
