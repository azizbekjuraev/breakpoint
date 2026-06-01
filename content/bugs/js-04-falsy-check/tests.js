test('user 42 is found', () => {
  assert.ok(
    getLogs().includes('looking up user #42'),
    'findUser(42) did not return the expected lookup message'
  );
});

test('user 0 is valid and gets looked up', () => {
  assert.ok(
    getLogs().includes('looking up user #0'),
    'User ID 0 is being rejected — the check is treating 0 as missing'
  );
});

test('undefined id returns "no user provided"', () => {
  const logs = getLogs();
  const noUserCount = logs.filter((l) => l === 'no user provided').length;
  assert.equal(
    noUserCount,
    2,
    'Expected exactly 2 "no user provided" results (for undefined and null), got ' + noUserCount
  );
});
