import App from './App';

test('clicking Logout shows "Not logged in" without crashing', async () => {
  render(<App />);
  await wait(20);

  assert.ok(screen.queryByText("Alice's count: 0"), 'Should start logged in as Alice with count 0');

  fireEvent.click(screen.getByText('Logout'));
  await wait(100);

  assert.ok(
    screen.queryByText('Not logged in'),
    'Expected to see "Not logged in" — React likely threw because hooks were called in a different order on this render',
  );
});
