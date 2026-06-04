## Hint 1

The effect runs once with `[]` deps. What value of `count` does the interval callback see _every_ time it fires?

## Hint 2

The interval closes over `count` from the initial render, where it was `0`. Every tick calls `setCount(0 + 1)` — same value, React doesn't re-render, and the counter is stuck.

Use the functional form of the setter — it doesn't need to read `count` from the closure:

```ts
setCount((c) => c + 1);
```
