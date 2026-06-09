# Social icon links read as "link, link, link"

The footer has a row of three social icon links — a generic circle, square, and triangle standing in for whatever platforms you'd recognize. Each is wrapped in an `<a href="...">` so they're real links, not just decorative.

A screen reader landing on this row reads "link, link, link" with nothing else. There's no way to know which platform each link goes to without clicking it. Worse, the URLs themselves are the only identifying signal — and screen readers don't read those out by default.

This is the same problem you saw with icon buttons, applied to anchors. The fix is similar, but the rule name and edge cases differ.

**Before you run it: what do you think will happen, and why?**
