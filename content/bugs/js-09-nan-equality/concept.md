# NaN is not equal to itself

`NaN` ("Not a Number") is a special floating-point value that means "the result of an undefined or unrepresentable numeric operation." You get it from `0/0`, `Math.sqrt(-1)`, `parseInt('abc')`, or `'abc' * 2`.

`NaN` has one famously weird property: it is not equal to itself.

```
NaN === NaN   // false
NaN == NaN    // false
NaN !== NaN   // true  ← the only way to detect NaN without a helper
```

That means you can never check for NaN with `=== NaN`. The check always fails, regardless of the input.

The reliable check is `Number.isNaN(value)`. It returns `true` only for the actual `NaN` value — nothing else.

Avoid the *global* `isNaN()`. It coerces its argument to a number first, so `isNaN('hello')` is `true` (because `'hello'` becomes `NaN` when coerced). That's almost never what you want. `Number.isNaN` is the strict, modern version.

Why NaN behaves this way: it follows the IEEE-754 floating-point spec, where any operation involving NaN propagates NaN — including comparison. It's intentional, not a bug. But it makes "is this value NaN?" a question you can't answer with `===`.

**The lesson**: NaN is the only JavaScript value not equal to itself. Always use `Number.isNaN(value)` to test for it.
