## Hint 1

Inside `addTwo`, `count` is a value captured from the render that created this handler. What value does it hold when this version of the function runs? How does that affect the two `setCount(count + 1)` calls?

## Hint 2

`count` is a snapshot from the last render — both `setCount(count + 1)` calls see the same value (e.g., `0` on the first click), and both queue `setCount(1)`. React batches them; the final state is `1`, not `2`. Use the functional form so each call sees the latest pending value: `setCount((c) => c + 1)`.
