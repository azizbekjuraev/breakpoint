## Hint 1

Margins on grid items live **inside** their cell — they push the item away from the cell edges, including the outermost cells. That's why the first item is offset from the container.

The grid container itself supports a property designed exactly for inter-item spacing without leaking out to the edges.

## Hint 2

Remove `margin: 8px` from the items. Add `gap: 16px` (or whatever spacing you want) to the `.grid` container.

`gap` only applies *between* tracks — never at the outer edges. That's the whole point.
