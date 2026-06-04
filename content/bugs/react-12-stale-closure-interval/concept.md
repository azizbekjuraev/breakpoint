# Effects with empty deps capture a single snapshot of state

`useEffect(() => { ... }, [])` runs its callback exactly once, on mount. The function it creates — including the `setInterval` callback inside it — closes over the values that were in scope at mount time. Those values are frozen. They do _not_ update when the component re-renders.

In the broken code:

```ts
useEffect(() => {
  const id = setInterval(() => {
    setCount(count + 1);  // `count` is captured from mount: always 0
  }, 30);
  return () => clearInterval(id);
}, []);
```

The interval's callback references `count` from the render where the effect ran — i.e., the initial render, where `count` was `0`. Every 30ms it computes `setCount(0 + 1)`. The first tick updates state to `1` and triggers a re-render. The interval callback still sees `count === 0` from its closed-over scope, so the next tick also calls `setCount(1)` — same value, React skips the re-render, and the counter is stuck.

You have two genuine fixes:

**1. Use a functional update.** `setCount` accepts a function that receives the latest state. The function doesn't depend on the closed-over `count`, so there's no stale-closure problem:

```ts
setCount((c) => c + 1);
```

This is almost always what you want for "increment based on previous value" patterns.

**2. Add `count` to the deps array.** Now the effect re-runs whenever `count` changes — tearing down and recreating the interval each time, with a fresh closure:

```ts
useEffect(() => {
  const id = setInterval(() => setCount(count + 1), 30);
  return () => clearInterval(id);
}, [count]);
```

This works but it's wasteful — you're recreating the interval on every tick. Prefer the functional update.

**The general rule**: when a callback inside an effect needs to read state, ask "is the state value the same one the effect saw when it set up?" If the effect runs once but the callback fires many times, the state will drift away from the captured snapshot. Either re-subscribe on every change (deps array) or use a setter that doesn't need to read state (`setCount(c => ...)`, refs, etc.).
