# Components defined inside components get a new identity every render

React's reconciliation algorithm decides whether to keep or replace a rendered element based on its component _type_. For elements like `<div>`, the type is the string `"div"`. For your components, the type is the component function itself.

When you define a component inside another component, the inner function is _created fresh on every render_ of the outer one. From React's point of view, the type changes every time. Reconciliation sees "different component" and tears down the entire subtree — DOM nodes, state, refs, animations — replacing it with a new one.

The visible symptom is usually focus loss on inputs, but the same bug breaks:

- Animations (they restart)
- Uncontrolled inputs (their value resets)
- Refs (they point to a stale element)
- `useState` inside the inner component (it resets on every parent re-render)

Move the inner component to module scope so its reference is stable. If it needs data from the parent, pass it via props.

**The lesson**: define each component exactly once, at module scope. Never inside another component, never inside a `useMemo`, never inline. The function reference is part of React's identity contract.
