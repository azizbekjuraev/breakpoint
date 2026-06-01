## Hint 1

What does `Array.prototype.sort()` do _by default_ when comparing two elements? Try sorting `['10', '2', '20']` (strings) in your head.

## Hint 2

Without a comparator function, `sort` converts every element to a string and sorts lexicographically (character by character). That's why `'10'` comes before `'2'` — `'1'` is before `'2'` alphabetically. Pass a numeric comparator: `arr.sort((a, b) => a - b)`.
