## Hint 1

`forEach` doesn't return anything and doesn't wait for its callback to finish. What does it do with a promise returned from an `async` callback?

## Hint 2

`forEach` throws the returned promise away. The async callbacks all start, but `forEach` returns immediately, then `return results` runs while `results` is still empty.

Use `for (const id of ids) { ... }` with `await` inside (sequential), or `await Promise.all(ids.map(async (id) => ...))` (parallel).
