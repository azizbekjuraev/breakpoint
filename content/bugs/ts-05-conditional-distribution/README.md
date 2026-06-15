# ToArray<T | U> distributes when it shouldn't

`ToArray<T>` is supposed to turn a type into an array of that type. Reasonable expectation: `ToArray<string | number>` should be `(string | number)[]` — a single array that allows either element type.

What you get instead is `string[] | number[]` — *one* of those arrays, not a mixed one. Mixed-element arrays no longer typecheck. The behavior comes from a feature of conditional types that's silent unless you know to look for it. Tweak the type so distribution doesn't happen.

**Before you run it: when does a conditional type distribute, and what's the standard trick to stop it?**
