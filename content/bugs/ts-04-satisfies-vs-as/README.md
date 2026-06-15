# as Config widens the literal types away

`config` is a small constant. The author wanted two things: validate that the object matches the `Config` shape, and keep the exact `'dark'` literal so callers can write `if (config.theme === 'dark')` without a wider union getting in the way.

The current code uses `as Config`. That validates the shape, but it also widens `theme` to the full `'dark' | 'light'` union — the literal information is gone. A different TypeScript operator gives you both: shape validation *and* the precise inferred type.

**Before you run it: what's the operator name, and how does its semantics differ from `as`?**
