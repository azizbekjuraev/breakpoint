# Dependency arrays compare by reference, not by value

React compares each dep against its previous value using `Object.is` — a reference check for objects and arrays. Two objects with the same _contents_ are not equal if they're different instances. `{ a: 1 } !== { a: 1 }` because they're two separate objects in memory.

In the broken code:

```ts
function Card({ showAge }) {
  const config = { showAge, color: 'blue' };  // new object every render
  useEffect(() => { ... }, [config]);
}
```

`config` is recreated on every render — a brand-new object literal. React compares the new `config` to the previous one, sees they're different references, and re-runs the effect. The _values_ inside `config` haven't changed, but the dep array doesn't know that.

You have three good fixes:

**1. `useMemo` to stabilize the reference.** Now `config` is the _same_ object across renders unless `showAge` changes:

```ts
const config = useMemo(() => ({ showAge, color: 'blue' }), [showAge]);
```

**2. Use primitive deps instead of an object.** Primitives compare by value:

```ts
useEffect(() => { ... }, [showAge]);
```

This is the cleanest fix when the object is just a bag of primitives.

**3. Move the object out of the component entirely.** If the values are static, they don't need to be inside the render function at all:

```ts
const STATIC_CONFIG = { color: 'blue' };
```

**The general rule**: anything in a dependency array that's an object, array, or function should either come from props/state (where React stable-references it), or be wrapped in `useMemo` / `useCallback`. Otherwise you're re-firing the effect on every render — at best wasteful, at worst (if the effect calls `setState`) an infinite loop.

This bug is one of the most common sources of subtle React performance problems and the most common cause of "why is my effect running so much?"
