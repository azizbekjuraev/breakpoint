# Containing block: what "absolute" measures against

An absolutely-positioned element is removed from the normal document flow. Its `top`, `right`, `bottom`, `left` values are then measured relative to its **containing block**.

For most elements, the containing block is the nearest **positioned ancestor**: any ancestor whose `position` is not `static`. If no such ancestor exists, the containing block defaults to the **initial containing block** — essentially the viewport.

This explains the bug. The card uses the default `position: static`. So when the badge says "top-right with `top: 8px; right: 8px`", the browser dutifully measures from the viewport's top-right. The card isn't a positioning context at all.

The fix is one line: `position: relative` on the card. Now the card is a positioning context, and absolutely-positioned descendants measure against its borders. The card itself doesn't visually move (no `top`/`left` was provided) — `position: relative` here is purely structural.

This pattern — relatively-positioned parent, absolutely-positioned child — is one of the most common in CSS. Tooltips, badges, dropdowns, close buttons, "online" dots on avatars: all of them rely on it.

Related: `transform`, `filter`, and `will-change` (on certain values) also create positioning contexts, even without `position: relative`. That's an occasional surprise when a CSS transform on a parent suddenly "captures" an absolutely-positioned descendant.

**The lesson**: `position: absolute` needs a positioned ancestor. Without one, it escapes to the viewport.
