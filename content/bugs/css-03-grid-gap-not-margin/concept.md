# `gap` vs item margins

Before CSS Grid and modern flexbox, the standard way to space items was with `margin`. Want 16px between cards? `margin-right: 16px` on each card. Then you'd add `:last-child { margin-right: 0 }` to peel off the rightmost margin, or `:first-child { margin-left: 0 }`, depending on which side leaked.

It worked, but it was fragile. Wrapping rows broke it. Reordering broke it. Adding a sibling broke it.

**`gap`** is the modern replacement. It lives on the **container**, not the item. It applies *only* between adjacent items, never on the outer edges. That means:

- Items sit flush with the container's content edge — exactly where you'd expect.
- Spacing stays correct when items wrap to a new line.
- Adding or removing items doesn't require special-casing the ends.

`gap` works in both Grid and Flex. (It also accepts two values: `gap: 16px 24px` for row-gap and column-gap respectively.)

When you see `margin` being used for spacing between sibling items in a grid or flex container, that's almost always a candidate for refactor to `gap`. The exception is when you intentionally want different margins on different items — but for a uniform layout, `gap` wins.

**The lesson**: container-level `gap` is for between-item spacing. Item-level `margin` leaks to the outer edges and creates alignment headaches.
