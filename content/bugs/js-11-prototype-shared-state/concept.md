# Prototype properties are shared by all instances

When you write `Cart.prototype.items = []`, you create _one_ array, attached to the prototype object. Every instance created with `new Cart()` looks up `items` through that same prototype — so every instance reads and writes the _same_ underlying array.

For _primitive_ defaults this is mostly harmless: writing `instance.x = 5` creates an _own_ property on the instance that shadows the prototype's default. But arrays and objects are mutated _in place_ — `this.items.push(...)` doesn't create an own property, it reaches through the prototype and mutates the shared array.

The fix is to assign instance state inside the constructor. `function Cart() { this.items = []; }` runs once per `new`, creating a fresh array as an _own_ property of the instance. Now each cart has its own `items`, and mutations stay isolated.

**The general rule**: methods belong on the prototype (shared behavior), state belongs on the instance (per-object data). Reference-type defaults on the prototype are almost always a bug.
