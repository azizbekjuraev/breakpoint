# User settings include keys we never set

`listKeys` should return the keys that the _user_ set on their settings object: `['theme', 'fontSize']`.

Instead, it returns `['theme', 'fontSize', 'language', 'notifications']` — the user's keys _plus_ two defaults that live somewhere else.

**Where do `language` and `notifications` come from, and how do we list only the keys that were actually set on this object?**
