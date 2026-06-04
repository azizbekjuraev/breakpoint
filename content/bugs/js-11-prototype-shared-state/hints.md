## Hint 1

Where does `items` live? Trace what happens when `a.items.push('apple')` runs. Is `a.items` an own property of the instance, or is it inherited from somewhere else?

## Hint 2

`Cart.prototype.items = []` puts a single array on the prototype object. Every instance shares it. The fix is to give each instance its own `items` — assign it inside the constructor with `this.items = []` so a fresh array is created per `new Cart()`.
