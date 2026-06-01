# Don't store what you can compute

Every piece of state in your component is a piece of state you have to remember to keep in sync. The more state you store, the more places that can drift out of sync from each other.

`total` is a function of `items`. It will _always_ equal the sum of prices — there's no scenario where they should diverge. Storing it separately means every `setItems(...)` has to also `setTotal(...)`, and any time you forget, the UI lies.

Compute derived values during render instead:

```
const total = items.reduce((sum, item) => sum + item.price, 0);
```

This runs on every render, but it's cheap — and it's always correct. For expensive computations, use `useMemo` to cache between renders, but only after measuring a real perf problem.

The rule of thumb: "can I compute this from existing state or props?" If yes, compute it. If you can only know it via user input or external data, it deserves its own state.

**The lesson**: state is for _inputs_ to your component (user actions, async data). Outputs — anything derivable from those inputs — should be computed during render. Less state means fewer ways to be wrong.
