test('first two direct calls log count 1 and 2', async () => {
  await wait(50);
  const logs = getLogs();
  assert.equal(logs[0], 'count: 1');
  assert.equal(logs[1], 'count: 2');
});

test('setTimeout callback logs count: 3', async () => {
  await wait(50);
  const logs = getLogs();
  assert.equal(
    logs[2],
    'count: 3',
    'Expected count: 3 after setTimeout — the method must keep its binding to counter'
  );
});

test('no NaN appears in the logs', async () => {
  await wait(50);
  const logs = getLogs();
  assert.ok(
    !logs.some((l) => l.includes('NaN')),
    '"this" was lost — the function ran without counter as its context'
  );
});
