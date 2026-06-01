## Hint 1

Read the second argument to `useEffect`. What is React told to do with the empty array `[]`? When does the effect re-run?

## Hint 2

`[]` means "run once on mount, never again." The effect captures `count` in a closure when count is 0, and never re-runs — so `document.title` is set once to `'Count: 0'` and stays there. List `count` in the deps array so React re-runs the effect whenever count changes: `}, [count]);`
