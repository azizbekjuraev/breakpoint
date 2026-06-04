# One ping increments the counter by 3

`Pinger` listens for a global `breakpoint-ping` event and bumps its counter. We expect each `Ping` click to add exactly 1.

After clicking **Change id** a couple of times and then **Ping** once, the count jumps from 0 to 3 — as if three handlers fired for a single event. The handler is wired up correctly. Why are there three of them?
