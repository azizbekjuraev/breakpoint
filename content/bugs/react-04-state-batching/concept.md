# `setState` with a stale value batches incorrectly

In React, state updates inside an event handler are _batched_ — React doesn't immediately re-render between each call. Instead, it queues the updates and applies them once the handler finishes.

When you write `setCount(count + 1)`, the value `count + 1` is computed using the snapshot of `count` from the render that created this handler. If you call `setCount(count + 1)` twice, both calls compute the same target (e.g., `0 + 1`), and the final batched state is `1`.

The functional form fixes this:

```
setCount((c) => c + 1);
setCount((c) => c + 1);
```

React calls each updater with the latest pending state, so the first one takes `0 → 1` and the second takes `1 → 2`. Final state: `2`.

This pattern matters whenever multiple updates can target the same piece of state in the same tick — increment buttons, counters, queues, "do N things" handlers. If you're calling `setX(...)` more than once with a derived value, reach for the functional form.

**The lesson**: when the new state depends on the old state, use the functional updater. It's safe, and it makes batching predictable.
