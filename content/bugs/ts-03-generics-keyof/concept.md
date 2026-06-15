# Generics, keyof, and indexed access

Generic functions exist so the *caller's* types can flow through to the *return type*. A signature like `(obj: object, key: string) => unknown` throws every interesting fact away — the compiler stops being able to help you because the function has volunteered to know nothing.

Three building blocks turn this into a precise tool:

- **A type parameter for the object**: `<T>`. Bound it however little or much you need — usually unbounded, sometimes `extends object`.
- **A type parameter for the key, constrained to the object's actual keys**: `<K extends keyof T>`. `keyof T` is the union of literal string (and number/symbol) types that are valid property names on `T`. Constraining `K` here is what turns a typo into a compile error.
- **An indexed access type for the return**: `T[K]`. This is "the type of the value at property K of T". It tracks per-key — pluck a `name` and you get `string`, pluck an `id` and you get `number`.

Put together:

```ts
function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

The body is trivial — `obj[key]` works because `K extends keyof T`. The *signature* is doing all the work.

This pattern shows up everywhere: building `Pick`, defining a memoized getter, writing a typed event emitter, designing an ORM helper. Once you internalize `T`, `keyof T`, and `T[K]` as a trio, a lot of "magic" library code stops looking magical.

**The lesson**: when you find yourself returning `any` or `unknown` from a generic helper, you've probably lost the connection between an input and the output. Look for a missing type parameter that would carry the information through.
