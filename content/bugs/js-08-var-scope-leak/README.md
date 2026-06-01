# Low scores get a grade of undefined

`rank(score)` should print a letter grade — A for ≥90, B for ≥80, C for ≥70, and F for anything below.

For scores 95, 85, and 75, it works. For score 50, it logs `grade: undefined`. The grade variable is declared inside the if-blocks, so why is it readable outside?

**Before you run it: try mentally replacing `var` with `let`. Would the same code even compile?**
