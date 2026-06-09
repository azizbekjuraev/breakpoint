test('first item is flush with the grid container (no outer margin)', () => {
  const grid = $('.grid');
  const items = $$('.item');
  const gRect = rect(grid);
  const firstRect = items[0].getBoundingClientRect();

  assert.close(firstRect.left, gRect.left, 2, 'first item left edge should align with grid left edge');
  assert.close(firstRect.top, gRect.top, 2, 'first item top edge should align with grid top edge');
});

test('last item is flush with the grid container on the right', () => {
  const grid = $('.grid');
  const items = $$('.item');
  const gRect = rect(grid);
  const lastInRow = items[1].getBoundingClientRect();

  assert.close(lastInRow.right, gRect.right, 2, 'item B should align with grid right edge');
});

test('items still have spacing between them', () => {
  const items = $$('.item');
  assert.equal(items.length, 4, 'expected 4 items');
  const a = items[0].getBoundingClientRect();
  const b = items[1].getBoundingClientRect();
  const horizontalGap = b.left - a.right;
  assert.ok(
    horizontalGap >= 8,
    'expected at least 8px between adjacent items, got ' + Math.round(horizontalGap) + 'px',
  );
});
