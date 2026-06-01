## Hint 1

Arrays in JavaScript are passed by reference, not by value. What does `list.push(item)` do to the array that was passed in?

## Hint 2

`push` mutates the array in place — it modifies the _caller's_ array, then returns the new length. To return a fresh array without affecting the original, use a non-mutating operation: spread (`[...list, item]`), `concat` (`list.concat(item)`), or copy-then-push.
