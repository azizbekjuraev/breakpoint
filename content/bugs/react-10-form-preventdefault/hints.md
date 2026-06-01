## Hint 1

A `<form>` has a default behavior: submitting it navigates to its `action` URL (or the current URL if no action is set), sending the form data along. React's `onSubmit` fires _before_ that default — but it doesn't stop it.

## Hint 2

Call `e.preventDefault()` at the top of your handler. That tells the browser "skip your default behavior," so React's state updates run instead of the page navigating away.
