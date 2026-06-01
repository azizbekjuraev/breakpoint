# Input values stick to position instead of moving with items

Each row has its own input field for adding a note. Type `hello` in B's input, then click *Add to front* to insert a new item at position 0. The list becomes `[NEW, A, B, C]` — but the `hello` you typed has moved to A's row instead of staying with B.

**Before you run it: how does React decide which old component instance to reuse for each new render? Look at the `key` prop.**
