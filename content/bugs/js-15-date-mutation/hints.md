## Hint 1

`date.setMonth(...)` — does this return a new date, or does it modify `date` in place? What does the function return after that line runs?

## Hint 2

`Date` setters mutate the date they're called on. `addMonth` mutates its argument and then returns the same reference, so `createdAt` and `dueAt` end up pointing to the same modified object.

Clone the date first: `const next = new Date(date); next.setMonth(next.getMonth() + 1); return next;`
