# Logging out crashes the component

The component shows the logged-in user and a counter. Click _Logout_ and the entire component blows up — instead of showing "Not logged in," it throws a "Rendered fewer hooks than expected" error.

**Before you run it: count the `useState` calls in the function. Now imagine `user` is `null` — how many run on that render?**
