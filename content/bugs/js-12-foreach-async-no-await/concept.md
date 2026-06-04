# `Array.prototype.forEach` ignores promises

`forEach` was designed before `async`/`await` existed. It calls the callback for each element and throws away whatever the callback returns. If your callback is an `async` function, that returned promise is silently discarded — `forEach` does not wait, and the function containing it does not pause.

So when you write:

```js
ids.forEach(async (id) => {
  const data = await fetchData(id);
  results.push(data);
});
return results;
```

`forEach` fires off three async callbacks, each of which immediately suspends at its own `await`. Then `forEach` itself completes (it just synchronously called three functions), and the next line — `return results` — runs while `results` is still empty. The fetches eventually finish in the background, but the caller already got the empty array back.

The fix is to use a loop that actually understands promises. Two common patterns:

- **`for...of` with `await`** — sequential. Each fetch finishes before the next one starts.
- **`Promise.all(ids.map(...))`** — parallel. All fetches start immediately, and `await` resolves when the last one finishes.

Pick `Promise.all` when fetches are independent and you want speed; pick `for...of` when each step depends on the previous one, or you need to rate-limit.

**The rule**: `forEach`, `map`, `filter`, and friends are not promise-aware. The moment you put `await` inside them, switch to an explicit loop or `Promise.all`.
