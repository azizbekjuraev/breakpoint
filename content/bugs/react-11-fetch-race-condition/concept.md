# Effects don't cancel — you have to cancel them yourself

When you fire off an async request inside `useEffect`, React doesn't track the promise. If the effect's dependencies change before the promise resolves, the effect runs _again_ — starting a second request — but the _first_ request is still in flight. When it finally resolves, its `.then` callback calls `setState` with stale data, overwriting whatever the newer request already wrote.

This is the canonical "fetch race condition" and it shows up in almost every codebase that fetches inside `useEffect`. The order of operations is:

1. Render with `userId=1`. Effect runs. Slow fetch for user 1 begins.
2. Props change to `userId=2`. Effect re-runs. Fast fetch for user 2 begins.
3. Fast fetch resolves first → `setName('Alice')`.
4. Slow fetch resolves second → `setName('Bob')`. _The wrong user is now displayed._

The fix is to use the cleanup function `useEffect` already gives you. When the effect re-runs (or the component unmounts), React calls the previous effect's cleanup. Set a flag there, and check it before calling `setState`:

```ts
useEffect(() => {
  let cancelled = false;
  fetchUser(userId).then((u) => {
    if (!cancelled) setName(u.name);
  });
  return () => {
    cancelled = true;
  };
}, [userId]);
```

Now the slow fetch still completes, but its `setName` is gated behind `cancelled` — which the next effect's cleanup flipped to `true`. The stale write is silently dropped.

The more modern alternative is `AbortController`:

```ts
useEffect(() => {
  const ctrl = new AbortController();
  fetch(`/users/${userId}`, { signal: ctrl.signal })
    .then((r) => r.json())
    .then((u) => setName(u.name))
    .catch(() => {}); // swallow AbortError
  return () => ctrl.abort();
}, [userId]);
```

`AbortController` actually cancels the request (saving bandwidth), where the boolean flag just discards the response. Both fix the race; pick whichever fits your API.

**The general rule**: any async work inside a `useEffect` needs a cleanup. If you can't think of how an in-flight request would be invalidated, you have a race condition waiting to happen.
