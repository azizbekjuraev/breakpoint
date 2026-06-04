## Hint 1

`useState(loadInitialItems())` — what does JavaScript do with the parentheses _before_ calling `useState`? When does the function actually run?

## Hint 2

The `()` evaluates the function call immediately on every render. JavaScript runs `loadInitialItems()`, gets the result, and _then_ passes that result to `useState`. React ignores the value after the first render, but the function still ran.

Pass the function _reference_ (no parens) so React can call it only once, on mount:

```ts
const [items] = useState(loadInitialItems);
// or
const [items] = useState(() => loadInitialItems());
```
