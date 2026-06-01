## Hint 1

When you write `setTimeout(counter.increment, 10)`, you're passing the function _value_ to setTimeout. Later, when setTimeout calls it, how is it being called — as `counter.increment()`, or as a plain function?

## Hint 2

`this` in JavaScript is determined by _how_ a function is called, not where it's defined. `counter.increment()` is a method call (`this` is `counter`). But once setTimeout has the function reference and calls it, it's just a plain function call — `this` is no longer `counter`. Fix it by preserving the binding: `setTimeout(() => counter.increment(), 10)` or `setTimeout(counter.increment.bind(counter), 10)`.
