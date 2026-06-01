test('original array is unchanged', () => {
  const logs = getLogs();
  assert.ok(
    logs.includes('original: [1,2,3]'),
    'Original array was mutated — addItem should not modify its caller\'s data'
  );
});

test('updated array contains the new item', () => {
  const logs = getLogs();
  assert.ok(
    logs.includes('updated: [1,2,3,4]'),
    'Updated array does not contain the appended item'
  );
});

test('updated is a different array than original', () => {
  const logs = getLogs();
  assert.ok(
    logs.includes('same reference: false'),
    'addItem returned the same array reference — must return a new array'
  );
});
