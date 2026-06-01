# `var` leaks out of blocks

In JavaScript, `var` is _function-scoped_, not _block-scoped_. A `var` declaration inside any block (if, for, while) is hoisted to the top of the enclosing function — meaning the variable exists for the entire function, starting with the value `undefined`, until some assignment runs.

This breaks one of the most natural mental models you bring from other languages: that braces create scopes. With `var`, they don't. With `let` and `const`, they do.

The result: variables declared inside conditional branches "leak" outside, but stay `undefined` if no branch ran. Reading the variable later gives you `undefined` — no error, no warning, just silent bad data.

`let` and `const` are block-scoped. A `let grade` inside an `if` block exists _only_ inside that block. Reading it outside the block is a ReferenceError. The compiler catches the bug for you.

The fix is two-part:

1. Switch from `var` to `let`/`const` everywhere. There is essentially no reason to use `var` in modern JavaScript.
2. Initialize at declaration. `let grade = 'F'` gives a guaranteed default; the if-block updates it conditionally.

**The lesson**: every variable should have block scope and an initial value. Together, they make "what's the value of this variable right now?" answerable by reading.
