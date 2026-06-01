# Hooks must be called in the same order every render

React identifies which state belongs to which `useState` call by *call order*. There's no name, no tag — just the position. On every render, React expects to see exactly the same sequence of hook calls.

When you call a hook inside an `if`, an early return, a loop, or a nested function, the order changes between renders. React's first render might see `[useState, useState]`; a render after some state change might see `[useState]` because an early return skipped the second one. React detects this mismatch and throws — and your component dies.

The Rules of Hooks:

1. Call hooks at the top level of your component (or custom hook). Not inside loops, conditions, or nested functions.
2. Call hooks from React function components or custom hooks. Not from regular functions, classes, or event handlers.

The fix is structural: move every hook to the top of the function, before any conditional logic. If you need conditional behavior, conditionally use the *value*, not the hook.

ESLint's `react-hooks/rules-of-hooks` catches this at lint time — turn it on. The Rules of Hooks are not a style preference; they're a hard runtime invariant.

**The lesson**: in a React function component, every call to a hook must run, in the same order, every single render. Top of the function, no exceptions.
