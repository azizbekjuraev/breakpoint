# Links describe their destination, not their decoration

The accessible-name rules for `<a>` echo the ones for `<button>` — text content wins, then `aria-labelledby`, then `aria-label`, then `title`. The difference in spirit is *what the name should say*. A button's name describes the action it performs ("Close", "Save"). A link's name describes the destination it goes to ("Twitter profile", "Documentation", "Cart").

That distinction matters because screen-reader users frequently navigate by listing all links on a page. If half of them are named "click here" or "link, link, link," that list is useless. A good link name stands on its own — read aloud out of context, you still know where it leads.

For icon-only links, the same two patterns from icon buttons apply:

- `aria-label` on the `<a>` with the destination's name.
- A visually-hidden text span inside the `<a>`, with the icon marked `aria-hidden="true"`.

The hidden-text approach has a small advantage for links specifically: if a user copies the link to share it, they get text along with it in some applications. Pragmatically, either pattern is fine — pick one and use it consistently.

Two related traps:

- `title="Twitter"` *does* contribute to the accessible name in some browsers, but it's an unreliable fallback. Don't use it as your only label.
- An `<a>` wrapping both an icon *and* visible text is the easiest case of all — the visible text becomes the name. Most "icon-only" links can become "icon + label" links without much design pain.

**The lesson**: links need names that describe where they go, not what they look like.
