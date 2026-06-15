test('your code typechecks', () => {
  assertNoErrors();
});

test('format accepts both branches of the union', () => {
  assertTypechecks(`
    const a: string = format('hello');
    const b: string = format(42);
  `);
});

test('format rejects values outside the union', () => {
  assertTypeError(`format(true);`);
  assertTypeError(`format(null);`);
});

test('format still returns string', () => {
  assertTypechecks(`const r: string = format('x');`);
  assertTypeError(`const r: number = format('x');`);
});
