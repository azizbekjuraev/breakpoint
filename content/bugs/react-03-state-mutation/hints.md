## Hint 1

`items.push('Cherry')` mutates `items` in place — it doesn't return a new array. What does `setItems(items)` pass to React, in terms of reference?

## Hint 2

React compares the new state to the old state using `Object.is` (essentially `===`). If the reference is unchanged, React skips the re-render. `items.push(...)` mutates the existing array, so `setItems(items)` passes the same reference React already has. To trigger an update, create a *new* array: `setItems([...items, 'Cherry'])` (or use `.concat`).
