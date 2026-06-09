# Grid items don't line up with the container edge

A 2×2 grid of cards. The original author used `margin: 8px` on each item to create gaps between them. It almost works — but the first column's left edge is pushed in from the grid container's left edge by 8 extra pixels, and the last column's right edge has the same issue.

The grid should sit flush against its container. Spacing between items should still be there, just not as outer margin.

**Before you run it: what do you think will happen, and why?**
