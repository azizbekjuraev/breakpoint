# `Date` setters mutate in place

`Date` is a mutable object. Its setters — `setMonth`, `setDate`, `setHours`, `setFullYear`, and friends — change the date they're called on and return a primitive number (the new timestamp in milliseconds), not a new `Date`. There is no immutable "add a month" method built into `Date`.

In the broken code:

```js
function addMonth(date) {
  date.setMonth(date.getMonth() + 1);
  return date;
}
```

`date` is the same object reference that the caller is holding. Mutating it changes the caller's date. Returning it doesn't help — `createdAt` and `dueAt` end up pointing to the _same_ mutated object.

The fix is to clone the date before mutating. `new Date(date)` (passing an existing Date to the constructor) produces a fresh copy with the same timestamp:

```js
function addMonth(date) {
  const next = new Date(date);
  next.setMonth(next.getMonth() + 1);
  return next;
}
```

You can also use `new Date(date.getTime())` for the same effect, or — if you're on a modern runtime — reach for the new `Temporal` API, where dates are immutable by design.

**The general rule**: when a function takes a reference-type argument (Date, Array, Object, Map, Set), assume the caller doesn't expect you to mutate it. Either clone first, or document loudly that the function mutates. This is why utility libraries like `date-fns` exist — they wrap `Date` to make every operation return a new instance.
