## Hint 1

Look at the `<Row>` elements rendered in the `.map`. The `key={i}` tells React which row is which. When you insert a new item at the front, what changes about the indexes?

## Hint 2

Inserting at position 0 shifts every existing item down by one — but the indexes (0, 1, 2, …) stay the same. With `key={i}`, React thinks "position 0 is the same item as before," reuses the old component instance there (with its state), and just changes the props. State sticks to position, not to the item. Use a stable id: `key={item.id}`.
