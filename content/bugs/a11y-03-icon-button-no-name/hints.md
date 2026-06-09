## Hint 1

The button has no text node — only an SVG. There's nothing for the browser to compute as an accessible name. The icon is visual-only; assistive tech needs a string.

## Hint 2

Two clean fixes:

- Add `aria-label="Close"` to the `<button>`. This is the standard pattern for icon-only controls.
- Or add a visually-hidden span inside the button: `<span class="sr-only">Close</span>`. Sighted users still see the icon; the text is in the DOM for screen readers.

Bonus: add `aria-hidden="true"` on the SVG so it isn't double-announced as a decorative graphic on top of the button's accessible name.
