# `this` is determined by how a function is called

In JavaScript, `this` is not bound to where a function is defined — it's bound to *how* the function is called. The same function can have different values of `this` depending on the call site.

Three common call patterns:

- **Method call**: `obj.fn()` → `this` is `obj`
- **Function call**: `fn()` → `this` is `undefined` (strict mode) or the global object (sloppy mode)
- **Constructor call**: `new Fn()` → `this` is a fresh object

When you do `setTimeout(counter.increment, 10)`, you're passing the function *value* to setTimeout. Later, setTimeout calls it with no object context — it's a plain function call now, not a method call. `this` is no longer `counter`.

Three ways to fix it:

1. **Wrap in an arrow function**: `setTimeout(() => counter.increment(), 10)` — `counter.increment()` *is* a method call inside the arrow, so `this` is `counter`.
2. **Explicit `bind`**: `setTimeout(counter.increment.bind(counter), 10)` — creates a new function with `this` permanently bound.
3. **Class fields with arrow methods**: define `increment = () => { this.count++ }` as a class field. Arrows don't have their own `this`, so it resolves to the instance.

**The lesson**: extracting a method into a variable disconnects it from its object. If you need to pass a method as a callback, bind it explicitly or wrap it.
