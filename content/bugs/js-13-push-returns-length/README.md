# groupBy crashes with 'push is not a function'

`groupBy` should bucket the numbers `[1, 2, 3, 4, 5]` by parity into `{ odd: [1, 3, 5], even: [2, 4] }`.

The first call works (sort of). The second call throws `TypeError: acc[key].push is not a function`. The grouping logic _looks_ right — what's actually being stored under each key?

**Why is `acc[key]` not an array on the second insertion?**
