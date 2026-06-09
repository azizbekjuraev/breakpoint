test('the close button has an accessible name', async () => {
  await assertAxePasses(['button-name']);
});

test('the close button name is not empty', () => {
  const btn = $('button.close');
  const ariaLabel = (btn.getAttribute('aria-label') || '').trim();
  const labelledBy = btn.getAttribute('aria-labelledby');
  const text = (btn.textContent || '').replace(/\s+/g, '').trim();

  let name = '';
  if (ariaLabel) {
    name = ariaLabel;
  } else if (labelledBy) {
    const ref = document.getElementById(labelledBy);
    name = (ref?.textContent || '').trim();
  } else {
    name = text;
  }

  assert.ok(
    name.length > 0,
    'button has no accessible name — add aria-label or a visually-hidden span with text',
  );
});
