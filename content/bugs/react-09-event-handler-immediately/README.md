# Button does nothing when clicked

Clicking _Log click_ should print `button clicked` to the console. Instead, the message appears once on mount and again every time you click `+` (which has nothing to do with logging) — but clicking _Log click_ itself does nothing.

**Before you run it: look closely at `onClick={logClick()}`. What is `logClick()` — a function reference, or the result of calling logClick?**
