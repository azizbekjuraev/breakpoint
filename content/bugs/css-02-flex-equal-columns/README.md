# Three columns refuse to fill the row

The design calls for three equal-width columns spanning the full row. The current implementation sets `width: 100px` on each column, so they sit cramped on the left and leave a giant gap on the right.

You want the columns to **divide the available space equally** and grow with the container — not to be locked at 100px.

**Before you run it: what do you think will happen, and why?**
