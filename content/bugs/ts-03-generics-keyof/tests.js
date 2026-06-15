test('your code typechecks', () => {
  assertNoErrors();
});

test('pluck returns the precise property type', () => {
  assertTypechecks(`
    const user = { id: 1, name: 'Alice' };
    const n: number = pluck(user, 'id');
    const s: string = pluck(user, 'name');
  `);
});

test('pluck rejects keys that do not exist on the object', () => {
  assertTypeError(`
    const user = { id: 1, name: 'Alice' };
    pluck(user, 'missing');
  `);
});

test('pluck preserves narrow return types (not unknown / not any)', () => {
  assertTypeError(`
    const user = { id: 1, name: 'Alice' };
    const wrong: string = pluck(user, 'id');
  `);
});
