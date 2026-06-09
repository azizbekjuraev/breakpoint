## Hint 1

Every `<img>` needs an `alt` attribute. Not "should have" — *needs*, syntactically. The absence of `alt` is treated differently from `alt=""` by assistive tech.

## Hint 2

If the image conveys meaning, describe what it shows in `alt`. Don't write "image of" or "picture of" — screen readers already announce that it's an image.

If the image is purely decorative — a flourish, a divider, a background-like element next to text that already says the same thing — use `alt=""` to mark it as such. The empty string is a signal: "skip this, the surrounding text covers it." That's different from no `alt` at all.
