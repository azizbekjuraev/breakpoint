test('list content actually overflows its height', () => {
  const list = $('.list');
  assert.ok(
    list.scrollHeight > list.clientHeight + 10,
    'content is not taller than the container — test is meaningless',
  );
});

test('list is scrollable (overflow-y is auto or scroll)', () => {
  const list = $('.list');
  const overflowY = style(list, 'overflow-y');
  assert.ok(
    overflowY === 'auto' || overflowY === 'scroll',
    'overflow-y should be auto or scroll, got "' + overflowY + '"',
  );
});

test('user can scroll the list to reveal hidden items', () => {
  const list = $('.list');
  // Scroll near the bottom programmatically; if the container isn't scrollable, scrollTop stays at 0.
  list.scrollTop = list.scrollHeight;
  assert.ok(
    list.scrollTop > 0,
    'scrollTop did not move — the list is not actually scrollable',
  );
});
