# User name comes back as undefined

`getUserName(42)` should return `"User 42"`. Instead, it returns `undefined`.

The code looks straightforward — call `getUser`, grab `.name` off the result, return it. So why isn't `.name` defined?

**Before you run it: what type of value does `getUser(id)` return? What does `user.name` evaluate to in this code?**
