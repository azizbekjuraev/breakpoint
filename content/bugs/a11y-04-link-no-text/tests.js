test('every social link has an accessible name', async () => {
  await assertAxePasses(['link-name']);
});

test('link names are distinct, not generic', () => {
  const links = $$('a.social-link');
  assert.equal(links.length, 3, 'expected 3 social links');

  const names = links.map((a) => {
    const ariaLabel = (a.getAttribute('aria-label') || '').trim();
    if (ariaLabel) return ariaLabel;
    const labelledBy = a.getAttribute('aria-labelledby');
    if (labelledBy) {
      const ref = document.getElementById(labelledBy);
      return (ref?.textContent || '').trim();
    }
    return (a.textContent || '').replace(/\s+/g, ' ').trim();
  });

  for (let i = 0; i < names.length; i++) {
    assert.ok(
      names[i].length > 0,
      'link ' + (i + 1) + ' has no accessible name',
    );
    assert.ok(
      !/^(link|click here|here|more)$/i.test(names[i]),
      'link ' + (i + 1) + ' has a generic name ("' + names[i] + '") — describe the destination',
    );
  }

  const unique = new Set(names.map((n) => n.toLowerCase()));
  assert.equal(
    unique.size,
    names.length,
    'social links should each point to a different destination and be named accordingly',
  );
});
