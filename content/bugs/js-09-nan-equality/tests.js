test('NaN is detected as invalid', () => {
  assert.ok(
    getLogs().includes('NaN: true'),
    'NaN was reported as valid — you cannot compare to NaN with === or ==.'
  );
});

test('"abc" * 2 (also NaN) is detected as invalid', () => {
  assert.ok(
    getLogs().includes('abc: true'),
    "'abc' * 2 evaluates to NaN, but the check missed it."
  );
});

test('actual numbers are not flagged', () => {
  const logs = getLogs();
  assert.ok(logs.includes('42: false'), '42 should be valid');
  assert.ok(logs.includes('zero: false'), '0 should be valid');
});
