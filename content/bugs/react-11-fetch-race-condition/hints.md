## Hint 1

Two fetches are in flight at different speeds. Which one calls `setName` _last_? Why does that matter for what the user sees?

## Hint 2

The slow fetch from the previous selection eventually resolves and calls `setName`, overwriting the value the newer fetch already wrote. `useEffect` gives you a cleanup function — use it to set a flag that the previous fetch's `.then` checks before calling `setName`:

```ts
useEffect(() => {
  let cancelled = false;
  fetchUser(userId).then((u) => {
    if (!cancelled) setName(u.name);
  });
  return () => { cancelled = true; };
}, [userId]);
```
