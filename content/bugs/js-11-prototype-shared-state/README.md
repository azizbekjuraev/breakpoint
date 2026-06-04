# Two carts somehow share the same items

We create two `Cart` instances and add a different item to each. We expect cart `a` to contain `['apple']` and cart `b` to contain `['bread']`.

Instead, both carts end up with `['apple', 'bread']` — and `a.items === b.items` is `true`.

**Why do two separate `new Cart()` instances share the same `items` array?**
