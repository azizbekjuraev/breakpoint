test('groups numbers by parity correctly', () => {
  assert.ok(
    getLogs().includes('result: {"odd":[1,3,5],"even":[2,4]}'),
    'Expected {"odd":[1,3,5],"even":[2,4]} — push returns the new length, not the array, so the assignment is throwing the array away',
  );
});

test('does not throw a TypeError', () => {
  const logs = getLogs();
  assert.ok(
    !logs.some((l) => l.startsWith('error:')),
    'groupBy threw — acc[key] is being set to push\'s return value (a number), and the next push call fails',
  );
});
