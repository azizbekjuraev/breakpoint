# removeEventListener does nothing

`setup()` adds a click listener. `teardown()` calls `removeEventListener` with what looks like the same handler.

But when a click fires after `teardown()`, the listener still runs. Removal silently failed.

**Before you run it: look at the two arrow functions. They have identical bodies. Are they the same function?**
