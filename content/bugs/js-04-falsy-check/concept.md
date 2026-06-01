# Truthy/falsy checks aren't "is this present" checks

JavaScript has six falsy values: `false`, `0`, `''`, `null`, `undefined`, and `NaN`. Everything else is truthy.

The shortcut `if (!value)` treats _all_ falsy values as "missing" — but most of the time, what you actually mean is "missing" (null or undefined), not "any falsy value." When `0`, `''`, or `false` are valid inputs, the truthy check rejects them as if they were missing.

This is the same bug that makes form validation lose the user's `0` input, makes "did the API return data" checks fail on empty strings, and makes "is this option set" checks fail on `false`.

For "is this value present?" use one of:

- `value == null` — true for `null` _and_ `undefined` only. This is the rare case where `==` is idiomatic.
- `value === undefined` — strictest, only undefined.
- `value != null` — true if value is anything else.

For "is this an empty string?" check `value === ''`. For "is this zero?" check `value === 0`. Be specific about what you're testing for.

**The lesson**: "is this value present" and "is this value truthy" are different questions. Use the check that matches the question you're actually asking.
