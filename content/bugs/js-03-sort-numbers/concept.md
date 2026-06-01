# `sort()` is lexicographic by default

`Array.prototype.sort()` looks like it should "just work" on numbers, but it doesn't. Without a comparator function, it does this:

1. Converts every element to its string representation.
2. Sorts the strings lexicographically (character by character, using UTF-16 code points).

That's why `[10, 1, 2, 20]` sorts to `[1, 10, 2, 20]`: the string `"10"` starts with `'1'`, which comes before the string `"2"`. The numeric values are never compared.

The fix is a comparator function. `sort` calls it with two elements and expects:

- A negative number → `a` comes before `b`
- A positive number → `a` comes after `b`
- Zero → equivalent

For ascending numeric: `arr.sort((a, b) => a - b)`. For descending: `arr.sort((a, b) => b - a)`.

The same applies to dates (compare `getTime()`), case-insensitive strings, or any custom ordering — `sort` doesn't know what "order" means for your data. You tell it.

Also worth knowing: `sort` mutates the array in place _and_ returns it. If you need to keep the original, copy first: `[...arr].sort(...)` or use the newer `arr.toSorted(...)`.

**The lesson**: `sort` doesn't infer how to compare your data. Always pass a comparator unless you genuinely want lexicographic string ordering.
