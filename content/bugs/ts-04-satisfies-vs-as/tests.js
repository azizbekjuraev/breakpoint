test('your code typechecks', () => {
  assertNoErrors();
});

test('config.theme keeps its literal type (not widened to the union)', () => {
  assertTypechecks(`const t: 'dark' = config.theme;`);
});

test('config.retries is still number', () => {
  assertTypechecks(`const r: number = config.retries;`);
});

test('shape is still validated — unknown properties are rejected', () => {
  assertTypeError(`const x: number = config.nonexistent;`);
});

test('wrong literal values would still fail to compile (shape check works)', () => {
  // If a learner deletes the constraint entirely (no `as` and no `satisfies`),
  // an invalid theme value should still be caught. This snippet rebinds the
  // shape and proves the constraint is doing its job.
  assertTypeError(`
    const bad = {
      theme: 'green',
      retries: 3,
    } satisfies Config;
  `);
});
