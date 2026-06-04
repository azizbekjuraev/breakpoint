test('returns the full result array, not empty', async () => {
  await wait(200);
  assert.ok(
    getLogs().includes('result: ["data-1","data-2","data-3"]'),
    'processAll returned the wrong value — forEach does not await async callbacks, so the function returns before any fetch finishes',
  );
});

test('does not return an empty array', async () => {
  await wait(200);
  assert.ok(
    !getLogs().includes('result: []'),
    'processAll returned [] — the loop did not actually wait for the fetches',
  );
});
