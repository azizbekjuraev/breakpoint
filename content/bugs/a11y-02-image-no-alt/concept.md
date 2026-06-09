# alt is required, "" is a real value

The `alt` attribute is one of HTML's stricter requirements: every `<img>` is supposed to have one. When it's missing entirely, screen readers fall back to announcing the filename, the surrounding text, or — worst case — nothing at all. The user knows something is wrong, but not what they're missing.

The trick is that `alt=""` and *no alt attribute* mean different things:

- `alt="A red leather backpack on a wooden floor"` — informative. The image carries meaning; describe it.
- `alt=""` — decorative. The image is presentational filler that adds nothing the surrounding text doesn't already convey. Screen readers will skip it cleanly.
- *(no alt)* — broken. The author didn't decide. Assistive tech has to guess.

So writing `alt=""` is **not** a cheap way to silence the linter — it's a deliberate "I've checked, this image is decorative" claim. For a product photo on a product card, that claim is false: the photo *is* the product. Describe it.

Two related notes:
- Avoid "image of" / "picture of" in `alt`. The screen reader already says "graphic" or "image."
- For SVG icons used in buttons or links, the icon itself isn't the thing that needs a label — the *control* does, usually via `aria-label`. We'll see that pattern in later bugs.

**The lesson**: `alt` is mandatory. Choose between describing the image and explicitly marking it decorative — never skip the attribute.
