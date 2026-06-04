## Hint 1

The effect depends on `[id]`. What happens when `id` changes? Trace what's attached to `window` after two id changes.

## Hint 2

The effect adds a listener every time it runs, but never removes the previous one. Each `id` change leaves another stale listener attached, and one dispatched event fires all of them.

Return a cleanup function from the effect that removes the listener:

```ts
useEffect(() => {
  function handler() { setCount((c) => c + 1); }
  window.addEventListener('breakpoint-ping', handler);
  return () => window.removeEventListener('breakpoint-ping', handler);
}, [id]);
```
