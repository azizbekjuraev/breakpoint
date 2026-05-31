## Hint 1

Look at how `i` is declared in the loop. What's the scope of that variable, and how many copies of it exist?

## Hint 2

`var` is function-scoped, not block-scoped. There is only one `i` in memory, shared across all iterations. By the time the `setTimeout` callbacks fire (10ms later, after the loop has finished), `i` has been incremented to 6, and every callback reads that same value.
