# React skips re-renders when state references don't change

When you call a setter from `useState`, React compares the new value to the current value using `Object.is`. If they're equal, React skips the re-render entirely — an important optimization, but one that makes mutation invisible.

Mutating an array (`push`, `pop`, `splice`, `sort`) modifies the existing reference. When you then call `setItems(items)`, React sees the same reference it already has and bails out. The underlying data did change, but React has no way to know.

Always pass a new array (or object) to the setter:

- `setItems([...items, x])` — spread + append
- `setItems(items.concat(x))` — concat returns a new array
- `setItems(items.filter(...))` — filter returns a new array
- For objects: `setUser({ ...user, name: 'Bob' })`

This is the same `reference-vs-value` principle from the JS track (`js-02-array-mutation`), but with React's re-render check making the consequence visible: nothing updates.

**The lesson**: treat state as immutable. Create a new array or object when updating, even if the contents are otherwise the same. Strict-mode warnings and immutability linters can catch most direct mutations.
