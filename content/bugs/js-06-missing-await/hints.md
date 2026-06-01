## Hint 1

Look closely at `const user = getUser(id)`. What does `getUser` return — a user object, or something else?

## Hint 2

`getUser` returns a Promise — an object that _will_ resolve to the user, but hasn't yet. You're calling `.name` on the Promise itself, not on the resolved user. Promises don't have a `.name`, so you get `undefined`. Add `await`: `const user = await getUser(id)`.
