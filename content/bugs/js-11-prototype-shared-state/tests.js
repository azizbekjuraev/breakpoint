test('cart a contains only apple', () => {
  assert.ok(
    getLogs().includes('a: ["apple"]'),
    'Cart a should contain only ["apple"], not the items from cart b',
  );
});

test('cart b contains only bread', () => {
  assert.ok(
    getLogs().includes('b: ["bread"]'),
    'Cart b should contain only ["bread"], not the items from cart a',
  );
});

test('carts do not share the same items array', () => {
  assert.ok(
    getLogs().includes('shared: false'),
    'a.items and b.items are still the same array reference — items must be created per-instance, not on the prototype',
  );
});
