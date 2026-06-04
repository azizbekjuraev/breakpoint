# `for...in` walks the prototype chain

`for...in` iterates over the _enumerable_ keys of an object _and_ every object in its prototype chain. If you're working with a plain object literal (`{}`), this rarely bites you — `Object.prototype`'s built-ins are non-enumerable. But the moment you use `Object.create(parent)` or any prototype-based inheritance, `for...in` starts handing you keys you didn't put on the object.

In this bug, the user's settings are created with `Object.create(defaults)`. That makes `defaults` the prototype of `userSettings`. When the user writes `userSettings.theme = 'dark'`, that's an own property. But `for...in` doesn't stop there — it walks up to `defaults` and yields `language` and `notifications` too.

There are several ways to fix this, each with a different shape:

- **`Object.keys(obj)`** — returns only own, enumerable, string keys. Almost always what you want when "iterating over an object."
- **`Object.hasOwn(obj, key)` inside the loop** — keeps `for...in` but filters to own properties. Use when you specifically need `for...in` (rare).
- **`for...of` with `Object.entries(obj)`** — when you want both key and value.

`Object.keys` is the standard fix and the one you should reach for by default.

**The rule**: `for...in` is rarely the right tool in modern JavaScript. Reach for `Object.keys` / `Object.entries` / `Object.values` instead — they only see own properties, and they signal intent more clearly.
