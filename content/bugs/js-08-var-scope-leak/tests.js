test('low score (50) gets grade F', () => {
  assert.ok(
    getLogs().includes('grade: F'),
    'Score 50 should produce "grade: F" — currently no branch assigns to grade and it stays undefined',
  );
});

test('no "undefined" appears in output', () => {
  assert.ok(
    !getLogs().some((l) => l.includes('undefined')),
    'A variable is being read before any branch assigned it a value',
  );
});

test('high scores still rank correctly', () => {
  const logs = getLogs();
  assert.ok(logs.includes('grade: A'));
  assert.ok(logs.includes('grade: B'));
  assert.ok(logs.includes('grade: C'));
});
