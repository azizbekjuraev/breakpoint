# Controlled inputs need both `value` and `onChange`

In React, a form input can be *controlled* (React owns its value via state) or *uncontrolled* (the DOM owns its value). Mixing the two creates this exact bug.

When you set `value={state}`, React forces the input to display whatever `state` is on every render. The user types — the DOM briefly shows the new character — but on the next render, React resets the input's `value` back to `state`. If `state` never updates, the input appears frozen.

To make it controlled correctly, you need both halves: `value` (read) *and* `onChange` (write). The handler reads the new value from the event and updates state. The next render shows the new state.

```
<input
  value={name}
  onChange={(e) => setName(e.target.value)}
/>
```

If you actually want an uncontrolled input — useful for forms where React doesn't need to read the value on every keystroke — use `defaultValue` instead of `value`, and read with a ref or on submit.

**The lesson**: `value` without `onChange` is a contradiction — you're telling React it owns the value, but never giving it a way to update it. React lets you do it, but the input becomes read-only.
