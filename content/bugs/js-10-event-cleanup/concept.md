# Function identity matters for `removeEventListener`

`addEventListener` and `removeEventListener` identify listeners by _reference_, not by code. Two functions with the same body are still two different function objects — they have different identities in memory.

```
const a = () => console.log('hi');
const b = () => console.log('hi');
a === b   // false
```

This is why writing the listener inline twice doesn't work:

```
element.addEventListener('click', () => doThing());
element.removeEventListener('click', () => doThing());  // a different function!
```

The first arrow is registered. The second is a brand-new function the listener registry has never seen. Removal silently fails — no error, no warning.

The fix: save the listener once, pass the same reference both times.

```
const handler = () => doThing();
element.addEventListener('click', handler);
element.removeEventListener('click', handler);
```

This is also why React's `useEffect` cleanup pattern works the way it does — the effect captures the handler in a closure, and the cleanup function uses the same reference.

Memory consequence: an event listener you can't remove is a _memory leak_. The element, the function, and everything the function closes over stay in memory until the element itself is destroyed. In a long-lived page, leaks accumulate.

**The lesson**: function identity is by reference, not by code. To remove a listener, you must hold onto the exact function you added.
