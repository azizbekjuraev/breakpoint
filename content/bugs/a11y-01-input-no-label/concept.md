# Inputs need an accessible name

Every interactive control — input, button, link — needs an **accessible name**: the string that assistive tech announces when focus lands on it. For inputs, the browser computes that name from a short list of sources, in order: an associated `<label>`, then `aria-labelledby`, then `aria-label`, then `title`. Placeholder text and adjacent siblings don't count.

The pattern fails when designers treat the visible text next to an input as if it were a label, when really it's just a `<span>` sitting nearby. Visually they're grouped. Programmatically they're strangers.

The fix is to make the relationship explicit, in one of three ways:

- **Implicit**: wrap the input in a `<label>`. The text inside the label becomes the name.
- **Explicit `for`/`id`**: `<label for="search-input">Search</label>` paired with `<input id="search-input">`.
- **ARIA**: `aria-labelledby` pointing at the id of an existing element, or `aria-label` with the string directly.

Prefer real `<label>` elements when there's visible text. They give you the accessibility connection *and* a bigger click target — clicking the label focuses the input. ARIA labels are the right tool when there's no visible text (icon-only controls), not when there is.

**The lesson**: visual proximity isn't a label. The connection has to be in the markup.
