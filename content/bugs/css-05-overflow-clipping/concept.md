# The overflow property: four values, four meanings

When content is taller (or wider) than its container, CSS asks: what should happen to the extra? That's what `overflow` controls.

The four values:

- **`visible`** (default) — overflow spills out and is visible. The container's painted bounds stay the same, but content can render outside it. Often surprising in production layouts.
- **`hidden`** — anything outside the container's bounds is clipped. No scrollbar, no way to reach the hidden content. Useful for decoration clipping (e.g. rounded-corner images), not for showing long content.
- **`auto`** — scrollbars appear *only when needed*. If content fits, no scrollbar. If it overflows, a scrollbar is added on the appropriate axis. The most common choice for scrollable UI regions.
- **`scroll`** — scrollbars are always shown, even if content fits. Used when you want layout stability (no jump when content grows past the container).

You can also split horizontal and vertical via `overflow-x` and `overflow-y`. A common pattern is `overflow-y: auto; overflow-x: hidden;` — let the user scroll vertically but never sideways.

A scrollable container is detected at runtime by checking `el.scrollHeight > el.clientHeight` *and* that the computed `overflow-y` allows scrolling (`auto` or `scroll`). Both conditions matter: a tall element with `overflow: visible` isn't scrollable; it's just spilling.

**The lesson**: `overflow: hidden` removes content from view with no recovery; `overflow: auto` keeps it reachable.
