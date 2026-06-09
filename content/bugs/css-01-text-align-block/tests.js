test('button is horizontally centered in the container', () => {
  const container = $('.container');
  const button = $('.cta');
  const cRect = rect(container);
  const bRect = rect(button);

  const containerCenter = cRect.left + cRect.width / 2;
  const buttonCenter = bRect.left + bRect.width / 2;

  assert.close(buttonCenter, containerCenter, 2, 'button center is not aligned with container center');
});

test('button has not been stretched to full width', () => {
  const container = $('.container');
  const button = $('.cta');
  const cRect = rect(container);
  const bRect = rect(button);

  // Allow for padding; the button should be clearly narrower than the inner container.
  assert.ok(
    bRect.width < cRect.width - 32,
    'button width (' + Math.round(bRect.width) + ') should be much less than container (' + Math.round(cRect.width) + ')',
  );
});
