## Hint 1

What's the scope of a variable declared with `var` inside an `if` block? Try this in your head: if no branch executes, does `grade` still exist? What's its value?

## Hint 2

`var` is _function-scoped_, not block-scoped. Every `var grade` inside the if-branches gets hoisted to the top of the function — `grade` exists for the entire function with the value `undefined` until an assignment runs. For score 50, no branch assigns it, so `grade` stays `undefined`. Fix it by declaring once at the top with a default: `let grade = 'F'`. (Then `let` will also catch this kind of mistake at compile time.)
