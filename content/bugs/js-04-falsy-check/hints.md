## Hint 1

What values does `!id` consider falsy? List them. Which ones should the function actually reject, and which ones are valid inputs?

## Hint 2

`!id` is true for _all_ falsy values: `undefined`, `null`, `0`, `''`, `false`, `NaN`. But the spec only wants to reject `undefined` and `null`. Use a check that targets those specifically: `if (id == null)` catches both `null` and `undefined` and nothing else.
