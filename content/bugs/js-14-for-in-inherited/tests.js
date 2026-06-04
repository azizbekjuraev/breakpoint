test('returns only the user-set keys', () => {
  assert.ok(
    getLogs().includes('keys: ["theme","fontSize"]'),
    'Expected only ["theme","fontSize"] — listKeys should not include inherited keys from the prototype',
  );
});

test('does not include inherited "language" key', () => {
  const logs = getLogs();
  assert.ok(
    !logs.some((l) => l.startsWith('keys:') && l.includes('language')),
    '"language" lives on the prototype (defaults), not on userSettings itself — Object.keys would skip it',
  );
});

test('does not include inherited "notifications" key', () => {
  const logs = getLogs();
  assert.ok(
    !logs.some((l) => l.startsWith('keys:') && l.includes('notifications')),
    '"notifications" lives on the prototype (defaults), not on userSettings itself — Object.keys would skip it',
  );
});
