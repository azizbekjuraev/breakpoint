# Browser defaults run unless you stop them

Many HTML elements come with built-in behavior the browser performs automatically: links navigate, forms submit, checkboxes toggle, `target="_blank"` opens new windows. When you attach a React event handler, your handler runs *first* — and then, by default, the browser's behavior runs *too*.

For a `<form>`, the default is to navigate to the form's `action` (the current URL if none is set), bundling up form data as query parameters or a POST body. In a single-page app, that's almost never what you want — you want React to handle the submission in JavaScript, not the browser to navigate away.

`e.preventDefault()` tells the browser: "I've got this. Skip your default." Common places you need it:

- Form submission (this bug)
- `<a>` clicks where you want JavaScript routing instead of full navigation
- Drag/drop drop targets (browsers refuse drops by default)
- Some keyboard shortcuts (like preventing the browser's `Ctrl+S` save dialog)

It's safe to call even when there's nothing to prevent — `preventDefault` on an already-prevented event is a no-op.

**The lesson**: in browser apps, "form submit" means "navigate by default unless told otherwise." React doesn't change that. If you're handling submission in JavaScript, call `e.preventDefault()` first thing in the handler.
