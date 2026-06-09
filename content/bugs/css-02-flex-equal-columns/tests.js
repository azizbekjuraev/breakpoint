test('all three columns have equal width', () => {
  const cols = $$('.col');
  assert.equal(cols.length, 3, 'expected 3 columns');
  const widths = cols.map((c) => c.getBoundingClientRect().width);
  assert.close(widths[0], widths[1], 1, 'col 1 and col 2 widths differ');
  assert.close(widths[1], widths[2], 1, 'col 2 and col 3 widths differ');
});

test('columns share the row equally and fill its width', () => {
  const row = $('.row');
  const cols = $$('.col');
  const rowStyle = getComputedStyle(row);
  const padLeft = parseFloat(rowStyle.paddingLeft) || 0;
  const padRight = parseFloat(rowStyle.paddingRight) || 0;
  const gap = parseFloat(rowStyle.columnGap) || parseFloat(rowStyle.gap) || 0;

  const contentWidth = row.getBoundingClientRect().width - padLeft - padRight;
  const expectedColWidth = (contentWidth - 2 * gap) / 3;

  const widths = cols.map((c) => c.getBoundingClientRect().width);
  assert.close(
    widths[0],
    expectedColWidth,
    1.5,
    'col width is ' +
      Math.round(widths[0]) +
      'px; expected ~' +
      Math.round(expectedColWidth) +
      'px (equal share of row). Columns are not growing to fill the row.',
  );
});
