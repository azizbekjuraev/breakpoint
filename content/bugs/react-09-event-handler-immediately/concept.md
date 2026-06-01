# `onClick={fn}` passes the function; `onClick={fn()}` calls it immediately

This bug is so common it has a name: "the parentheses trap." React event handlers expect a function value — a reference to *something callable later*, when the event happens. Adding `()` calls the function during render, before any click has occurred.

The symptoms:

- The handler runs once on mount (during the first render).
- It runs again on every re-render (during each subsequent render's evaluation).
- Clicking the button does nothing, because what was actually assigned to `onClick` is the function's *return value* — usually `undefined`.

The fix is to drop the parentheses:

```
<button onClick={handleClick}>             // ✓ reference
<button onClick={() => handleClick(arg)}>  // ✓ wrapped in arrow, fires on click
<button onClick={handleClick()}>           // ✗ calls during render
```

The "wrapped in arrow" form is what you use when you need to pass arguments. `() => handleClick(item.id)` is a function that, when called, calls handleClick with the right argument.

**The lesson**: parentheses execute. References don't. Event handlers want references. If your handler needs arguments at call time, wrap it in an arrow function.
