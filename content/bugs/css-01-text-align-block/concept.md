# text-align is for inline content

`text-align` is one of the most misunderstood properties in CSS. The name suggests "align this element's text" — and that's part of it. But the rule actually controls how **inline-level children** are arranged inside a **block-level container**.

When you write `text-align: center` on `.cta`, you're saying "center the inline things *inside* the button." There's nothing inline inside the button beyond its label, which is already as wide as the button itself, so the rule looks like a no-op.

To horizontally center the button, you need to do one of:

- Put `text-align: center` on the **parent** — because a button is inline-block by default, the parent's inline alignment rules apply to it.
- Use flex on the parent: `display: flex; justify-content: center;`.
- Switch the button itself to a block-level box with an explicit width: `display: block; width: fit-content; margin-inline: auto;`. The `width: fit-content` matters — without it, a block-level button stretches to fill the container, and you end up with a full-width bar instead of a centered button.

The first two are usually cleanest. Flex changes the layout model for the parent; `text-align: center` only affects inline-level children. Either is appropriate here.

**The lesson**: `text-align` aligns the inline things *inside* the element, not the element itself.
