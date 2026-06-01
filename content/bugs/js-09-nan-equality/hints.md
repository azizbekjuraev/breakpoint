## Hint 1

Open a console and evaluate `NaN === NaN`. What does it return? What about `NaN == NaN`?

## Hint 2

`NaN` is the only value in JavaScript that is *not equal to itself*. `NaN === NaN` is `false`. `NaN == NaN` is also `false`. There is no direct comparison that detects NaN. Use `Number.isNaN(value)` — the only reliable check. (Avoid the global `isNaN()`, which coerces its argument first and gives `true` for strings like `'abc'`.)
