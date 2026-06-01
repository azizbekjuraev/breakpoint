## Hint 1

`total` lives in its own `useState`. After `addCherry` adds a new item, does anything update `total`? If `total` is _always_ the sum of `items`, does it need to be its own state?

## Hint 2

`total` is _derived_ from `items` — it has no independent existence. Storing it in `useState` means every `setItems(...)` has to remember to update it too (and you didn't). Just compute it during render: `const total = items.reduce((sum, item) => sum + item.price, 0);`. Then it's always in sync, by construction.
