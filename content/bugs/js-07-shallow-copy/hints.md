## Hint 1

Object spread (`{...obj}`) creates a new top-level object. But what about the values *inside* — when a property's value is itself an object, is that nested object cloned, or shared?

## Hint 2

Spread copies one level deep. The new outer object is independent, but `copy.settings` is the *same object* as `original.settings`. To isolate the nested object, spread it too: `{ ...original, settings: { ...original.settings } }`. For arbitrary depth, use `structuredClone(original)`.
