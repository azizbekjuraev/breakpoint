# `useEffect` deps and stale closures

Every time a function component renders, its body re-runs — including the function you pass to `useEffect`. That function "closes over" the variables it reads from the surrounding render scope, capturing their values for that render.

React then decides whether to actually *run* the captured effect by comparing the dependency array to last render's. If the deps are unchanged (or the array is empty), React skips the run. The effect from a previous render is kept; its captured variables are frozen.

When you write `useEffect(() => { ... }, [])`, you're telling React: "run this once on mount, never again." The closure captures `count` when it's `0` and never sees a new value. The visible `count` in JSX updates on every render because that's a fresh closure each time — but the effect is the original one, looking at the original `count`.

The fix is to declare the value as a dependency: `[count]`. Now whenever `count` changes, React tears down the old effect (running its cleanup function, if any), creates a fresh closure with the new `count`, and runs it.

This is the same closure phenomenon as the `var` loop bug in JS — a function captures a binding, not a snapshot, and you need to give it the right scope.

**The lesson**: an effect's dependency array is your declaration of "what this effect depends on." Be honest. ESLint's `react-hooks/exhaustive-deps` rule can catch most mistakes here automatically.
