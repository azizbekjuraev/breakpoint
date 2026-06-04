## Hint 1

`config` is created with an object literal _inside_ the render function. What's the identity of that object on render 1 vs render 2 if you wrote `{} === {}`?

## Hint 2

A fresh object literal creates a new object every time the component renders, so `config` has a different reference each render even though its contents are identical. React's dep comparison is `Object.is` — references differ, effect re-runs.

Stabilize the reference with `useMemo`:

```ts
const config = useMemo(() => ({ showAge, color: 'blue' }), [showAge]);
```

Or, simpler, depend on the primitive directly:

```ts
useEffect(() => { ... }, [showAge]);
```
