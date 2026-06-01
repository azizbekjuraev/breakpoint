test('sorted numerically ascending', () => {
  assert.deepEqual(getLogs(), ['sorted: [1,2,10,11,20,100]']);
});

test('not sorted lexicographically', () => {
  const logs = getLogs();
  assert.ok(
    !logs.some((l) => l.includes('[1,10,100,11,2,20]')),
    'Numbers are still being sorted as strings — provide a comparator function'
  );
});
