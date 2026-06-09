# Icons aren't labels

A `<button>` gets its accessible name from its text content. `<button>Close</button>` announces as "Close, button" — easy. The trouble starts when the visible affordance is a glyph, not a word.

An SVG icon, an emoji, a CSS `::before` glyph — none of these contribute a useful accessible name. Screen readers will either announce nothing (`<svg>` with no `<title>`), the role only ("button"), or something useless ("graphic"). Voice control can't match a command like "click close" to a target that has no name.

The fix is to provide the name in a way the accessibility tree can pick up. Two idioms, both correct, slightly different trade-offs:

- **`aria-label="Close"`** on the button. Concise, no extra DOM. The trade-off: ARIA attributes don't get translated by browser auto-translate tools.
- **A visually-hidden span**: `<button><span class="sr-only">Close</span><svg…/></button>`. The text lives in the DOM, gets translated, and survives if ARIA is stripped. The trade-off: more markup, needs a `.sr-only` utility class.

For most apps, `aria-label` is the right default. For UIs that need to localize aggressively, the hidden-text pattern is safer.

A common follow-up: the SVG inside the button. Once the button has a name, the SVG is redundant noise. Add `aria-hidden="true"` to it (and drop any `focusable="true"` while you're there) so it stops being announced separately.

**The lesson**: interactive controls need a name in the accessibility tree. The visible icon does not provide one.
