# Spread is a shallow copy

In JavaScript, object spread (`{...obj}`) and `Object.assign({}, obj)` create a new top-level object whose properties are _copied by reference_ for non-primitive values. Nested objects and arrays are not cloned — they're shared.

When you spread `original` to make `copy`, you get a new outer object, but `copy.settings` is the _same object in memory_ as `original.settings`. Mutating it from either side affects both — they're two names for one thing.

Three ways to deep-copy:

1. **Manual nested spread**: `{...original, settings: {...original.settings}}` — explicit, fast, works when you know the shape.
2. **`structuredClone(original)`** — built-in deep clone, handles arrays, Maps, Sets, Dates. Doesn't handle functions or class instances.
3. **`JSON.parse(JSON.stringify(original))`** — the old hack. Loses functions, undefined values, symbols; dates become strings. Avoid when you can.

The mental model: spread is a one-level rebuild. If you need deeper isolation, you have to rebuild deeper.

This is also the bug that makes React state updates silently fail to re-render — you "spread" your state to "copy" it, but a nested object is still shared, and React (using reference equality) sees no change.

**The lesson**: spread creates shallow copies. For nested data, either spread each level you care about, or use `structuredClone`.
