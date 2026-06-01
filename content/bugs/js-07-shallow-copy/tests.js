test('original.settings.theme is unchanged', () => {
  assert.ok(
    getLogs().includes('original theme: dark'),
    'Mutating copy.settings also mutated original.settings — your spread only went one level deep'
  );
});

test('copy.settings.theme has the new value', () => {
  assert.ok(getLogs().includes('copy theme: light'));
});

test('original.settings and copy.settings are different objects', () => {
  assert.ok(
    getLogs().includes('same settings: false'),
    'original.settings and copy.settings still point to the same nested object'
  );
});
