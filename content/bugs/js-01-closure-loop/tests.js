test('logs 1 through 5 in order', async () => {
  await wait(100);
  const logs = getLogs();
  assert.deepEqual(logs, ['1', '2', '3', '4', '5']);
});

test('does not log the number 6', async () => {
  await wait(100);
  const logs = getLogs();
  assert.ok(
    !logs.includes('6'),
    'Found "6" in logs — closure is still capturing the post-loop value of i'
  );
});
