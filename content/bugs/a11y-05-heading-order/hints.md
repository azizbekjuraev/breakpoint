## Hint 1

Heading levels should never skip downward. After `<h1>` the next allowed levels are `<h1>` again (a new sibling section) or `<h2>` (a subsection). Jumping straight to `<h4>` leaves the screen-reader user wondering what `<h2>` and `<h3>` would have contained.

## Hint 2

Change the `<h4>` elements to `<h2>`. They're direct subsections of the article's `<h1>`, so they want level 2.

If the look of the `<h2>` doesn't match what you want visually, that's a CSS problem, not a markup problem — adjust the styling. Heading level and font size are independent decisions.
