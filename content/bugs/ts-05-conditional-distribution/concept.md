# Distributive conditional types

A conditional type written `T extends X ? A : B` *distributes* over a naked union when `T` is a bare type parameter on the left of `extends`. "Distributes" means the conditional is applied to each member of the union separately, and the results are unioned back together.

So `T extends any ? T[] : never` with `T = string | number` becomes:

- `string extends any ? string[] : never` → `string[]`
- `number extends any ? number[] : never` → `number[]`
- Union the results: `string[] | number[]`.

That's almost never what you want for an "I just want to wrap this in an array" type. It's exactly what you want for things like `Exclude<T, U>` (where distributing IS the point — you want to filter the union).

**The fix** is to disable distribution by wrapping the bare type parameter in a one-tuple:

```ts
type ToArray<T> = [T] extends [unknown] ? T[] : never;
```

Now the check is `[string | number] extends [unknown]`, which is a single test on a tuple — not distributed across the union. The result is the literal `(string | number)[]`.

A few useful facts:

- The trick works because the type parameter is no longer "naked" on the left of `extends`. Anything that wraps it — a tuple, an array, an object — suppresses distribution.
- Sometimes you *want* distribution. `type NonNull<T> = T extends null | undefined ? never : T;` works correctly *because* it distributes — each member of the union is filtered independently.
- The clue that you're being bitten by accidental distribution is "I got a union back when I expected a single composed type."

**The lesson**: bare type parameters on the left of `extends` distribute over unions. Sometimes that's a feature. Sometimes it's a footgun. Wrap in a tuple when you need to turn it off.
