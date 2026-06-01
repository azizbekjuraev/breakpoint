import App from './App';

test('clicking "Add 2" once increments count by 2', async () => {
  render(<App />);
  await wait(20);

  assert.ok(screen.queryByText('Count: 0'), 'Should start at 0');

  fireEvent.click(screen.getByText('Add 2'));
  await wait(50);

  assert.ok(
    screen.queryByText('Count: 2'),
    'Count should be 2, but both setCount calls saw the same stale count (0). Use the functional updater.'
  );
});

test('clicking "Add 2" twice increments count by 4', async () => {
  render(<App />);
  await wait(20);

  fireEvent.click(screen.getByText('Add 2'));
  await wait(30);
  fireEvent.click(screen.getByText('Add 2'));
  await wait(50);

  assert.ok(
    screen.queryByText('Count: 4'),
    'Expected count to be 4 after two clicks'
  );
});
