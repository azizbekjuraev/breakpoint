## Hint 1

The error is on `return found.name`. Hover the variable in your head: TypeScript sees `User | undefined`. The `.name` access is rejected because `undefined.name` would crash.

## Hint 2

Either narrow with an explicit guard, or use optional chaining with a fallback:

```ts
if (!found) return 'unknown';
return found.name;

// or
return found?.name ?? 'unknown';
```

Resist the urge to write `found!.name` — that silences the compiler without fixing the underlying problem.
