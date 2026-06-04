test('createdAt is not mutated', () => {
  assert.ok(
    getLogs().includes('createdAt: 2024-01-15'),
    'createdAt was mutated — Date setters change the date in place, so addMonth must clone the date before modifying it',
  );
});

test('dueAt is one month later', () => {
  assert.ok(
    getLogs().includes('dueAt: 2024-02-15'),
    'dueAt should be 2024-02-15',
  );
});

test('createdAt and dueAt are different Date instances', () => {
  assert.ok(
    getLogs().includes('sameRef: false'),
    'createdAt and dueAt are the same object reference — addMonth returned the mutated input instead of a fresh Date',
  );
});
