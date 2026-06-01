test('returns the correct user name', async () => {
  await wait(100);
  assert.deepEqual(getLogs(), ['name: User 42']);
});

test('does not return undefined', async () => {
  await wait(100);
  const logs = getLogs();
  assert.ok(
    !logs.some((l) => l.includes('undefined')),
    'getUserName returned undefined — you may be accessing .name on the Promise itself instead of the resolved user'
  );
});
