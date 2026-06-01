# Editing the copy mutates the original

Spreading an object should give you an independent copy. Here we do `const copy = { ...original }`, then change `copy.settings.theme` to `"light"` — and the _original_ changes too.

**Before you run it: what does `{ ...original }` actually copy? Top-level properties? Nested ones? Both?**
