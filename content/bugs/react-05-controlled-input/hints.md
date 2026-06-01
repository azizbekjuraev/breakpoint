## Hint 1

The input has a `value` prop. That makes it *controlled* — React owns its value. Where is the user's typing supposed to go?

## Hint 2

A controlled input needs an `onChange` handler that updates state — otherwise typing has nowhere to go: React keeps overwriting the input's value with the unchanged `name` state. Add `onChange={(e) => setName(e.target.value)}`.
