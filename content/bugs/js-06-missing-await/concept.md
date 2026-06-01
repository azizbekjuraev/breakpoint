# An async function returns a Promise, not its value

Every `async` function returns a Promise. Even if the function body returns a plain value, the function *call* gives you back a Promise that resolves to that value.

```
async function get() { return 42; }
get();        // Promise that resolves to 42 — NOT 42
await get();  // 42
```

When you call an async function (or any function that returns a Promise) and don't `await` it, you're holding a Promise object — an opaque container that has no `.name`, no `.id`, no `.length`. Accessing those properties returns `undefined`.

JavaScript won't warn you. It'll happily let you write `user.name` on a Promise, return `undefined`, and continue. The bug surfaces later, often far from where the mistake actually is.

A few useful rules:

- Inside an async function, treat every call to another async function as needing `await` until you have a reason not to.
- If you see `undefined` where you expected data, check whether you forgot to `await`.
- TypeScript catches most of these at compile time — the return type of an async function is `Promise<T>`, not `T`.
- Linters (`eslint-plugin-no-floating-promises`) catch un-awaited promises.

**The lesson**: `async` means the function *might* take time. `await` is how you wait for the actual value. Forget it, and you get the wrapper, not the contents.
