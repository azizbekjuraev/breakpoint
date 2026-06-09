## Hint 1

`overflow: hidden` does exactly what it says — it hides anything outside the box's bounds, no scrollbar, no escape hatch. That's useful for clipping decorations, not for showing a long list.

What other `overflow` values let the user still reach the hidden content?

## Hint 2

`overflow: auto` shows a scrollbar **only when needed** (content actually overflows). `overflow: scroll` shows it always. For most "scrollable region" UI, `auto` is the right pick.

Change `overflow: hidden` to `overflow: auto` (or `overflow-y: auto` to scroll only vertically).
