## Hint 1

The visible "Search" text is a `<span>`, not a `<label>`. To a screen reader, the input has nothing connecting it to that word — they're unrelated DOM nodes that just happen to sit next to each other.

## Hint 2

Two clean fixes:

- Wrap the input in a `<label>` so the text inside becomes its accessible name (implicit association).
- Or give the `<span>` an `id` and add `aria-labelledby="that-id"` on the input.

A `<label for="x">` paired with `<input id="x">` works too — that's the most explicit version of the same idea.
