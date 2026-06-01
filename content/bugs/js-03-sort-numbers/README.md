# Numbers sort in the wrong order

Sorting `[10, 1, 20, 2, 100, 11]` should give `[1, 2, 10, 11, 20, 100]`.

Instead, you get `[1, 10, 100, 11, 2, 20]`. The numbers are out of order — but in a strangely consistent way.

**Before you run it: stare at the broken output for a moment. Can you see the pattern? What's `sort()` actually comparing?**
