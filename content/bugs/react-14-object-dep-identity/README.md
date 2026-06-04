# Effect re-runs on every parent render

`Card` has an effect that should only run when the `config` it uses actually changes. We log every time the effect fires so we can see it.

The parent has an unrelated `Tick` button. Click it three times — `config` has nothing to do with `tick`. We expect the effect to run once (on mount).

Instead, the effect runs four times: mount + every Tick. The dependency array _has_ `config` in it. Why isn't React noticing it hasn't changed?
