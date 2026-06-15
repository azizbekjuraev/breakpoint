# Narrowing turns a union into a single type

A union type like `string | number` is the *uncertainty*. You don't know which one you have — only that it's one of them. Calling `.toUpperCase()` directly fails because that method exists on `string` but not on `number`. The compiler refuses to pick a side for you.

**Narrowing** is how you collapse a union down to a single member inside a branch of code. Once you've narrowed, the compiler treats the value as the narrower type for the rest of that branch.

The common narrowing tools:

- `typeof x === 'string'` — works for the primitive types `string`, `number`, `boolean`, `symbol`, `bigint`, `undefined`, `function`, `object`.
- `x instanceof Foo` — works for classes.
- `'prop' in x` — works for distinguishing object shapes.
- Discriminated unions — when each variant has a literal `kind` or `type` field.
- Custom type predicates (`function isUser(x): x is User`).

A narrowed branch is a contract: inside `if (typeof x === 'string') { ... }`, TypeScript guarantees `x` is `string`. Outside, it's back to `string | number` (or whatever's left after the narrow eliminated possibilities).

**The lesson**: when you see a union, the compiler is asking you to commit. Either narrow before you use type-specific methods, or change the signature so the union never reaches that code.
