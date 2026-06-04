## Hint 1

What does `Array.prototype.push` actually _return_? Trace what `acc[key]` holds after the first insertion for a new key.

## Hint 2

`push` returns the new `length` of the array, not the array itself. So `acc[key] = (acc[key] || []).push(x)` assigns the number `1` (not an array) to `acc[key]`. The next iteration tries to call `.push` on a number and crashes.

Split it into two steps: ensure the array exists, _then_ push to it. `acc[key] = acc[key] || []; acc[key].push(x);` — never reassign `acc[key]` to the return value of `push`.
