# Closures capture variables, not values

When a function references a variable from an outer scope, it doesn't take a _snapshot_ of that variable's value — it keeps a live _reference_ to the variable itself. Whatever value the variable holds when the function runs is what the function sees.

In the broken loop, all five `setTimeout` callbacks close over the _same_ `i`, because `var i` is function-scoped: there is only one `i` in memory, shared across iterations. By the time the timeouts fire (10ms later, after the loop has exited), `i` has been incremented to 6, and every callback reads that same final value.

Changing `var` to `let` creates a _fresh binding_ of `i` for each iteration of the loop. Now each callback closes over its own copy of `i`, and each one sees the value `i` had during _that_ iteration.

This is why modern JavaScript uses `let` and `const` everywhere. It's not stylistic — `var`'s function-wide scope creates exactly this kind of "why is this value not what I expected?" bug.

**The lesson**: in JavaScript, _scope_ determines what variable a name refers to, and _closures_ keep that reference alive. If you want each callback to see its own value, each callback needs to close over its own variable — which means a new binding per iteration.
