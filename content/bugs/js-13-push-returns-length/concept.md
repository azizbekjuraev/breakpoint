# `push` returns the new length, not the array

`Array.prototype.push` is one of the methods that mutates its receiver and returns something _other_ than the array — specifically, the new `length` after the push. This is occasionally useful (it lets you push and check the new length in one expression) but it's a sharp edge when you chain.

In the broken code:

```js
acc[key] = (acc[key] || []).push(x);
```

The first time a key appears, `acc[key]` is `undefined`, so `(acc[key] || [])` becomes `[]`. We push `x`, the array becomes `[x]`, and `.push(x)` returns `1`. We then assign `1` to `acc[key]`. The array we just built is thrown away.

On the next insertion for that key, `acc[key]` is `1` — a number. We try to call `.push(...)` on it, and JavaScript throws.

The fix is to split the assignment from the mutation:

```js
acc[key] = acc[key] || [];
acc[key].push(x);
```

Or, equivalently, use the `??=` operator:

```js
(acc[key] ??= []).push(x);
```

Both create the array if needed, then push into it _without_ overwriting `acc[key]` with `push`'s return value.

**The general lesson**: methods that mutate (`push`, `pop`, `shift`, `unshift`, `splice`, `sort`, `reverse`) sometimes return the modified array (`sort`, `reverse`), sometimes the new length (`push`, `unshift`), sometimes the removed element (`pop`, `shift`), and sometimes the removed slice (`splice`). When chaining onto them, double-check what you're getting back — or avoid chaining entirely and let the mutation stand on its own line.
