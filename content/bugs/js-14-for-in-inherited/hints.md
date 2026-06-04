## Hint 1

`userSettings` was created with `Object.create(defaults)`. What does that do to its prototype chain, and what does `for...in` do with the prototype chain?

## Hint 2

`for...in` walks the prototype chain and yields every enumerable key — including ones inherited from `defaults`. Use `Object.keys(userSettings)` instead. It only returns own, enumerable keys.
