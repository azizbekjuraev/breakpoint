## Hint 1

`onClick` expects a function — something to call *when the click happens*. What does `logClick()` (with the parentheses) give you? Is it a function or a value?

## Hint 2

`logClick()` *calls* `logClick` right there during render and returns its return value (`undefined`). `onClick` receives `undefined`, so the button has no handler. Drop the parentheses: `onClick={logClick}` passes the function reference itself, which React will call on click.
