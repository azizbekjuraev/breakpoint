# Counter ticks once then freezes at 1

`App` sets up a `setInterval` that increments `count` every 30ms. We expect the counter to climb steadily: 1, 2, 3, 4…

It increments to 1 and then stops. The interval _is_ still firing — but every tick, the count goes back to 1.

**Why does `setCount(count + 1)` keep producing 1 forever?**
