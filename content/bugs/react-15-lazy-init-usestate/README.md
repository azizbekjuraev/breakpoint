# Initializer runs on every render

`loadInitialItems` is supposed to be expensive — imagine it parsing JSON from `localStorage`, decoding a token, or doing a one-time computation. We pass it to `useState` so it runs once, on mount.

We log every call. The UI correctly shows the initial items. But click **Tick** a few times and the log fills up — `loadInitialItems` ran on _every_ render, even though `useState` clearly only uses the first value.

What's the difference between `useState(loadInitialItems())` and `useState(loadInitialItems)`, and why does it matter?
