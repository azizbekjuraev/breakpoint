# Every effect that subscribes to something must unsubscribe

`useEffect`'s return value is its cleanup function. React runs it when the effect's dependencies change (just before the new effect runs) and when the component unmounts. If you set something up — an event listener, a subscription, an interval, an observer — and you don't tear it down in the cleanup, it stays alive forever.

In the broken code:

```ts
useEffect(() => {
  function handler() { setCount((c) => c + 1); }
  window.addEventListener('breakpoint-ping', handler);
}, [id]);
```

Every time `id` changes, the effect runs again — adding a _new_ listener — without removing the previous one. After two `id` changes, you have three handlers attached to the same event. One `dispatchEvent` fires all three, and they all call `setCount((c) => c + 1)`. React batches the updates and applies each in order: 0 → 1 → 2 → 3.

The fix is to return a cleanup that removes the listener:

```ts
useEffect(() => {
  function handler() { setCount((c) => c + 1); }
  window.addEventListener('breakpoint-ping', handler);
  return () => window.removeEventListener('breakpoint-ping', handler);
}, [id]);
```

Now when the effect re-runs (or the component unmounts), the previous listener is removed. Only the most recent handler is attached, and one `Ping` increments by exactly 1.

**The general rule**: if your effect calls anything named `add*`, `subscribe`, `setInterval`, `setTimeout` (when you care about cancellation), `new Observer(...)`, or assigns to a global — you almost certainly need a cleanup. The mental model: "if this effect ran 100 times, what would stay behind?" If anything would, clean it up.

This bug compounds beyond a single component. In a real app, the leaked listener still holds a reference to the component's `setState`, which holds a reference to the React fiber, which holds a reference to the entire VDOM subtree. Every leak is a memory leak — and on subscriptions that fire frequently, also a performance leak.
