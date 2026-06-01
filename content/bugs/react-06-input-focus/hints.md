## Hint 1

`Input` is defined *inside* `App`. Each time `App` renders, what happens to the `Input` function? Is it the same function reference React saw last time, or a fresh one?

## Hint 2

Defining a component inside another component creates a brand-new function on every render. React's reconciliation compares component types by reference — different reference means "different component," so the old `<Input>` is unmounted and a new one is mounted. The DOM `<input>` is recreated; focus, selection, and uncontrolled state are all lost. Move `Input` *outside* `App` so its reference is stable, and pass `value` / `onChange` as props.
