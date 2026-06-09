test('the product image declares an alt attribute', async () => {
  await assertAxePasses(['image-alt']);
});

test('the product image alt is descriptive, not empty', () => {
  const img = $('img.thumb');
  const alt = img.getAttribute('alt');
  assert.ok(alt !== null, 'missing alt attribute');
  assert.ok(
    (alt || '').trim().length > 0,
    'alt="" marks an image as decorative — this product photo carries meaning and needs a real description',
  );
});
