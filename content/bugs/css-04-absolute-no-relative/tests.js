test('badge is positioned inside the card', () => {
  const card = $('.card');
  const badge = $('.badge');
  const cRect = rect(card);
  const bRect = rect(badge);

  assert.ok(
    bRect.right <= cRect.right + 1 && bRect.left >= cRect.left - 1,
    'badge horizontal range (' + Math.round(bRect.left) + '–' + Math.round(bRect.right) + ') is not inside card (' + Math.round(cRect.left) + '–' + Math.round(cRect.right) + ')',
  );
  assert.ok(
    bRect.top >= cRect.top - 1 && bRect.bottom <= cRect.bottom + 1,
    'badge vertical range is not inside card',
  );
});

test('badge sits in the top-right corner of the card', () => {
  const card = $('.card');
  const badge = $('.badge');
  const cRect = rect(card);
  const bRect = rect(badge);

  assert.close(bRect.top - cRect.top, 8, 2, 'badge top offset from card should be ~8px');
  assert.close(cRect.right - bRect.right, 8, 2, 'badge right offset from card should be ~8px');
});

test('card establishes a positioning context', () => {
  const card = $('.card');
  const pos = style(card, 'position');
  assert.ok(
    pos === 'relative' || pos === 'absolute' || pos === 'fixed' || pos === 'sticky',
    'card position should be non-static, got "' + pos + '"',
  );
});
