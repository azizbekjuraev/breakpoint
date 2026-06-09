test('heading levels do not skip', async () => {
  await assertAxePasses(['heading-order']);
});

test('the article uses h2 for its subsections (not h4)', () => {
  const post = $('.post');
  const headings = Array.from(post.querySelectorAll('h1, h2, h3, h4, h5, h6'));
  assert.ok(headings.length >= 4, 'expected an h1 and at least three subsection headings');

  const levels = headings.map((h) => parseInt(h.tagName.slice(1), 10));
  assert.equal(levels[0], 1, 'first heading should be the article title (h1)');

  for (let i = 1; i < levels.length; i++) {
    const delta = levels[i] - levels[i - 1];
    assert.ok(
      delta <= 1,
      'heading jumped from h' + levels[i - 1] + ' to h' + levels[i] + ' — levels must not skip down',
    );
  }

  for (let i = 1; i < headings.length; i++) {
    assert.equal(
      headings[i].tagName,
      'H2',
      'subsection ' + i + ' should be <h2> (direct child of the h1 outline), not <' + headings[i].tagName.toLowerCase() + '>',
    );
  }
});
