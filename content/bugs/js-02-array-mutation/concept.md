# Arrays are passed by reference

In JavaScript, primitive values (numbers, strings, booleans) are passed _by value_ — the function gets a copy. But objects and arrays are passed _by reference_ — the function gets the same underlying object, not a copy. Whatever you do to it from inside the function happens to the caller's data too.

This means any method that mutates an array (`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`) modifies the _caller's_ array. The function's "ownership" of the parameter is an illusion.

For predictable code, prefer non-mutating operations that return a new array:

- `[...arr, item]` — spread + append
- `arr.concat(item)` — concatenate
- `arr.filter(...)`, `arr.map(...)`, `arr.slice(...)` — already non-mutating

The mental model: think of arrays not as boxes you can rearrange, but as _immutable snapshots_. When you want a change, produce a new snapshot.

This becomes critical in React, where mutating state arrays silently breaks re-rendering. Once you default to non-mutating operations, an entire class of bugs disappears.

**The lesson**: mutation propagates across all references to the same object. Default to creating new arrays instead of modifying existing ones.
