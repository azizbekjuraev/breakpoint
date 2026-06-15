## Hint 1

Two type parameters. The first is the object type — call it `T`. The second is the key type — call it `K`. The relationship between them is `K extends keyof T`, which is what makes "pick a key that actually exists" a compile-time guarantee.

## Hint 2

Return type is `T[K]` — an indexed access type. That's the trick that lets the return value's type depend on which key was passed.

```ts
export function pluck<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}
```

No `as`, no `any`, no narrowing inside the body. The signature does all of it.
