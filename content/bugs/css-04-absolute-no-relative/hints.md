## Hint 1

`position: absolute` positions an element relative to its **nearest positioned ancestor**. "Positioned" means `position` is anything other than the default `static` — `relative`, `absolute`, `fixed`, or `sticky`.

If no ancestor is positioned, the browser falls back to the initial containing block (the viewport).

## Hint 2

Add `position: relative` to `.card`. Then the badge's `top: 8px; right: 8px;` will measure from the card's edges instead of the viewport's.

`position: relative` with no `top`/`left`/etc. doesn't move the element — it just makes the card a positioning context for absolutely-positioned descendants.
