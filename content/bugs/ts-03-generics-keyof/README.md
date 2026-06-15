# pluck() forgets which key it returned

`pluck(obj, key)` is supposed to grab a property off an object. The signature here works — it doesn't error — but it throws away every piece of useful type information in the process. The return type is `unknown`, and the key is just `string`, so callers can ask for properties that don't exist and still typecheck.

Rewrite the signature with generics so that:

- the key must be a real property of `obj` (typos fail to compile),
- the return type matches the actual property type (no casting needed at call sites).

The body can stay simple. The art is in the type parameters.

**Before you run it: how many type parameters do you need, and what constrains each one?**
