## Hint 1

`as Config` rewrites the type of `config` to `Config`. After that, `config.theme` is `'dark' | 'light'` — the union from `Config`, not the literal `'dark'` you actually wrote. That's why the precise-literal tests fail.

## Hint 2

Swap `as Config` for `satisfies Config`. Same validation, no widening:

```ts
export const config = {
  theme: 'dark',
  retries: 3,
} satisfies Config;
```

The compiler still rejects a misspelled field or wrong value type, but `config.theme` keeps its literal `'dark'` and you can index into the object with full precision.
