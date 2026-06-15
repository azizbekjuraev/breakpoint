test('your code typechecks', () => {
  assertNoErrors();
});

test('getName returns a string', () => {
  assertTypechecks(`
    const users: User[] = [{ id: 1, name: 'Alice' }];
    const s: string = getName(users, 1);
  `);
});

test('getName still rejects wrong argument types', () => {
  assertTypeError(`getName([{ id: 'x', name: 'a' }], 1);`);
  assertTypeError(`getName([], '1');`);
});
