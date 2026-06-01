# NaN is never detected as NaN

`isInvalidScore(score)` should return `true` when the score is `NaN`. It uses the most obvious check imaginable: `score === NaN`. But it returns `false` every single time — even when the input is *literally* `NaN`.

**Before you run it: what do you think `NaN === NaN` evaluates to?**
