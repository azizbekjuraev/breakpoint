test('the search input has an accessible label', async () => {
  await assertAxePasses(['label']);
});

test('the input has a non-empty accessible name', () => {
  const input = $('input.search-input');
  const labelledBy = input.getAttribute('aria-labelledby');
  const ariaLabel = input.getAttribute('aria-label');
  const id = input.id;

  let name = '';
  if (ariaLabel) {
    name = ariaLabel.trim();
  } else if (labelledBy) {
    const ref = document.getElementById(labelledBy);
    name = (ref?.textContent || '').trim();
  } else {
    const parentLabel = input.closest('label');
    if (parentLabel) {
      name = (parentLabel.textContent || '').trim();
    } else if (id) {
      const forLabel = document.querySelector('label[for="' + id + '"]');
      name = (forLabel?.textContent || '').trim();
    }
  }

  assert.ok(
    name.length > 0,
    'input has no accessible name — wrap it in a <label>, add aria-label, or use aria-labelledby',
  );
});
