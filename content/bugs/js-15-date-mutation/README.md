# addMonth changes the original date too

We create a `createdAt` date of `2024-01-15`. We call `addMonth(createdAt)` to compute the due date a month later, expecting `createdAt` to stay at January 15.

After the call, both `createdAt` and `dueAt` show `2024-02-15`. The "original" date got modified by the function we passed it to.

**Why does `addMonth` change its argument, and how do we compute a new date without touching the input?**
