# `flex: 1` and the three-value shorthand

When a child is in a flex container, three properties decide how it's sized along the main axis:

- `flex-grow` — how much of the **leftover space** the item takes when there's extra room.
- `flex-shrink` — how much it gives up when there isn't enough room.
- `flex-basis` — the starting size, before grow/shrink kicks in. Default: `auto` (the item's content size).

Writing `flex: 1` collapses to `flex: 1 1 0` — grow=1, shrink=1, basis=0. Crucially the basis is **0**, not `auto`. With basis 0, every sibling starts equal, and `grow: 1` means they share remaining space equally. That's why three children with `flex: 1` end up exactly the same width.

If you instead write `flex: 1 1 auto`, the basis becomes each item's content size — so a column with a long word starts larger and stays larger than its siblings. That's almost never what you want for equal columns.

A fixed `width` declaration on a flex child sets its preferred size but **can be overridden** by `flex-grow`/`flex-shrink`. Mixing them gets confusing fast. The cleaner mental model: in flex, prefer `flex` over `width` for the main axis.

**The lesson**: `flex: 1` shares space equally because the basis is zero. Don't fight it by also setting `width`.
