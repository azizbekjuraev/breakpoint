# processAll returns an empty array

`processAll` loops over a list of ids, fetches each one, and collects the results. We `await` `processAll` and log the result — we expect `['data-1', 'data-2', 'data-3']`.

Instead, the log shows `[]`. The fetches do eventually complete (you can see their logs fire afterwards), but `processAll` returns before any of them finish.

**Why does `await processAll(...)` not actually wait?**
