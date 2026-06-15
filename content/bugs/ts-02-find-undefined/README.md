# find() returns T | undefined

`getName` looks up a user by id and returns the name. The implementation calls `.find()` and then immediately accesses `.name`, which the compiler rejects: when no user matches, `.find()` returns `undefined`, and `undefined.name` throws at runtime.

Make the function typecheck while keeping the return type `string`.

**Before you run it: what should the function return when the id doesn't match anyone?**
