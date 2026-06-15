test('your code typechecks', () => {
  assertNoErrors();
});

test('ToArray<string> is still string[]', () => {
  assertTypechecks(`
    const a: ToArray<string> = ['a', 'b'];
  `);
});

test('ToArray<string | number> accepts a mixed array (no distribution)', () => {
  assertTypechecks(`
    const mixed: ToArray<string | number> = ['a', 1, 'b', 2];
  `);
});

test('ToArray<string | number> still rejects unrelated element types', () => {
  assertTypeError(`
    const bad: ToArray<string | number> = ['a', true];
  `);
});
