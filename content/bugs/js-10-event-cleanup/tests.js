test('listener was removed before the click fired', () => {
  assert.ok(
    !getLogs().includes('clicked'),
    'Listener was never actually removed — removeEventListener needs the SAME function reference passed to addEventListener'
  );
});

test('script reached the end', () => {
  assert.ok(getLogs().includes('done'));
});
