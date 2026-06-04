# `useState` evaluates its argument every render — pass a function to defer

`useState(initialValue)` receives a value. JavaScript evaluates that argument _before_ calling `useState`. So when you write:

```ts
const [items] = useState(loadInitialItems());
```

…on every render, JavaScript calls `loadInitialItems()`, gets a result, and _then_ passes it to `useState`. React looks at it and goes "this is the second render, I already have state, I'll ignore your initial value" — but the function still ran. The work was done; the result was thrown away.

The fix is the **lazy initializer** form. Pass a function reference, and React will only call it on the first render:

```ts
const [items] = useState(loadInitialItems);            // function reference
const [items] = useState(() => loadInitialItems());    // equivalent
```

Now React owns when the function runs. On mount, React invokes it once to compute the initial state. On every subsequent render, React skips the call entirely.

The difference is invisible if the initializer is cheap (a literal, a number). It becomes a real problem when the initializer:

- Parses JSON from `localStorage` or `sessionStorage` (touches the disk).
- Decodes a JWT, hashes a value, or does any heavy computation.
- Makes a network request (you should not be doing this, but people try).
- Has side effects you didn't mean to repeat — incrementing a counter, logging, etc.

**The same pattern exists for `useReducer`**: `useReducer(reducer, init, lazyInitFn)` — the third argument is a lazy initializer applied to the second.

**The general rule**: if the initial state of a hook is _computed_ rather than a literal, prefer the lazy form. It costs nothing when the computation is cheap, and saves you from a quietly expensive bug when it isn't.
