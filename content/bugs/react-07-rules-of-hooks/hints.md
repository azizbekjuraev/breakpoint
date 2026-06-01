## Hint 1

When `user` becomes `null`, the function returns early with `<p>Not logged in</p>`. What happens to the `useState(0)` call below that return? How many hooks did React see on the previous render vs this one?

## Hint 2

React identifies hooks by call _order_, not by name. On the first render, React saw two `useState` calls. After Logout, the early return skips the second one — React sees only one. It throws "Rendered fewer hooks than expected" because the order of hooks must be identical across every render. Move _all_ hook calls to the top of the function, before any conditional or early return.
