## Hint 1

Each `<a>` contains only an SVG. Like icon-only buttons, icon-only links have no text content for the browser to compute as a name. The href tells the browser where to go; it doesn't tell anyone what the link is for.

## Hint 2

Give each link an accessible name that says where it goes. Two patterns work:

- `aria-label="Twitter"` (or whichever platform) on the `<a>`.
- Or a visually-hidden span inside: `<a href="..."><span class="sr-only">Twitter</span><svg…/></a>`.

Either way, mark the inner SVG with `aria-hidden="true"` so screen readers don't announce a decorative graphic on top of the link name.

Avoid generic names like "click here" or "link" — they'd pass the rule but defeat the point.
