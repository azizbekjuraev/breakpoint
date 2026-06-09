# Headings are an outline, not a font picker

`<h1>` through `<h6>` express a *hierarchy*. The number isn't a size; it's a depth. A page's heading structure forms an outline:

```
h1 — page title
  h2 — section
    h3 — subsection
    h3 — subsection
  h2 — section
    h3 — subsection
```

That outline is one of the primary navigation tools for screen-reader users. They list headings, hop directly to a level, skim levels at a time. When the outline is sane, the page is navigable; when it's broken, the user has to fall back to reading sequentially or guessing what each section contains.

The classic mistake is choosing a heading level by visual weight: "I want this text smaller, so I'll use `<h4>`." That works in two-column print layouts where heading level *is* font size. On the web, levels and size are independent.

The two rules to internalize:

1. **Don't skip levels going down.** `h1 → h2 → h3` is fine. `h1 → h3` is broken. (Going *up* — `h3 → h2` for the next section — is fine and expected.)
2. **One `<h1>` per page (usually).** Modern HTML allows multiple, but most teams stick to one for the main title and use `<h2>` for top-level sections. Pick a convention and hold it.

If a level looks too big or too small for the design, fix the CSS. Don't downgrade the markup to match.

**The lesson**: heading numbers describe the document outline. They're for assistive tech, not designers.
