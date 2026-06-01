# "Add 2" only adds 1

The button is supposed to increment the count by 2 — it calls `setCount(count + 1)` twice in the handler. But each click only adds 1.

**Before you run it: what value does `count` have inside `addTwo`? Both `setCount` calls reference it — do they each see a different value?**
