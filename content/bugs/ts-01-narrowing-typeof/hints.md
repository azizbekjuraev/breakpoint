## Hint 1

The error is on the line that calls `.toUpperCase()`. The compiler knows `value` might be a number, and numbers have no `toUpperCase`. You need a branch where you've proven it's a string.

## Hint 2

A `typeof` check is the simplest narrow for primitives:

```ts
if (typeof value === 'string') {
  // value is string here
  return value.toUpperCase();
}
return String(value);
```

After the `if`, the compiler knows `value` is whatever's left of the union — in this case `number`. Convert it however makes sense for the caller.
