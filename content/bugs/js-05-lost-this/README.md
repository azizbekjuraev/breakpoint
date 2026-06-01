# Counter breaks when passed as a callback

The `counter.increment()` method works perfectly when called directly. But the moment you pass it as a callback to `setTimeout`, something goes wrong — the count stops incrementing properly.

**Before you run it: what do you expect each `count:` log to show? Then predict what happens to `this` inside `increment` when setTimeout calls it.**
