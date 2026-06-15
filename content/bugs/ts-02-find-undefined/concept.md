# Array methods that can come up empty

A lot of standard array methods return `T | undefined` for a reason: there's no value to return when the predicate doesn't match. `find`, `pop`, `shift`, and indexed access (`arr[42]` under `noUncheckedIndexedAccess`) all admit they might give back nothing.

The compiler models this honestly. When you write `users.find(...)`, the result type is `User | undefined`. Any attempt to access `.name` directly is a guaranteed-eventual NPE that the compiler can see from across the room.

Three reasonable patterns for handling it:

- **Narrow and return early**: `if (!found) return 'unknown'; return found.name;` — explicit, easy to read, and the compiler treats `found` as `User` after the guard.
- **Optional chaining + fallback**: `return found?.name ?? 'unknown';` — terser, equivalent semantics. Use when the fallback is obvious.
- **Throw on missing**: `if (!found) throw new Error('not found'); return found.name;` — good when the caller treats "not found" as a bug, not a normal outcome.

What you should *not* do is reach for `!` (the non-null assertion). `found!.name` tells the compiler "trust me, this is defined." If you're wrong, you get the same runtime crash you were trying to avoid — but now without a useful error path, and without future maintainers seeing the risk.

**The lesson**: `undefined` in a return type is a question the API is asking you. Answer it before you use the value.
