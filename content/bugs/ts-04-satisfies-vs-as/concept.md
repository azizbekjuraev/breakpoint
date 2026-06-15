# `satisfies` validates without rewriting

`as T` and `satisfies T` look similar from a distance — both let you reference a type when defining a value. They mean very different things to the compiler.

`as T` is a **type assertion**. It says "treat this expression as `T`, full stop." The compiler does a sanity check that the cast isn't wildly off, then *uses `T` from then on*. If `T` is wider than what you wrote literally, the literal information disappears — your `'dark'` becomes `'dark' | 'light'`. If `T` is narrower, the assertion is a lie that the compiler trusts you on.

`satisfies T` is a **constraint check**. It says "make sure this expression is assignable to `T`, but keep the value's actual inferred type." Shape errors still surface — a missing field or a wrong type fails the same way `as T` would. What you don't lose is precision: `theme: 'dark'` stays `'dark'`, the keys you wrote remain the keys the compiler knows about.

When to reach for which:

- **`satisfies`**: when you have a literal and you want both validation and full inference. Configs, route tables, mapped lookups, anything you'll later index into and want narrow return types for.
- **`as`**: rarely. Use it when you genuinely know more than the compiler — narrowing the result of a `JSON.parse`, or asserting after a runtime check the type system can't see. Never reach for it just to make a red squiggle go away.

The shorthand: `satisfies` keeps your knowledge, `as` overwrites it.

**The lesson**: type assertions are an escape hatch. When you actually want validation, ask for validation.
