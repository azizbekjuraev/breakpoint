# Keys identify list items across renders

When React renders a list, it has to decide which components from the previous render correspond to which in the new one. The `key` prop is how React makes that match.

With `key={i}` (the array index), the "identity" of each position is fixed. React thinks position 0 is always the same component — so when you insert at the front, the new item gets the old item's instance (and its state), and the displaced items shuffle through other indexes. Component state belongs to a *position*, not to your data.

With `key={item.id}` (a stable id from the data), React matches instances by id. Inserts, removes, and reorders all preserve state per item — exactly what you usually want.

This is the same issue that breaks animations, scroll positions, input focus, and any uncontrolled DOM state when lists change.

**The lesson**: array indexes are fine as keys only for static lists. If the list can be reordered, inserted into, or have items removed, use a stable id from your data. ESLint's `react/jsx-key` rule catches missing keys but not bad ones — `key={i}` looks fine until the list mutates.
