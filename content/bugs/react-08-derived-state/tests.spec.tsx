import App from './App';

test('total reflects the current items after adding', async () => {
  render(<App />);
  await wait(20);

  assert.ok(screen.queryByText('Total: $150'), 'Initial total should be $150');

  fireEvent.click(screen.getByText('Add Cherry'));
  await wait(50);

  assert.ok(
    screen.queryByText('Total: $225'),
    'Total did not update to $225 — it should be derived from items on each render, not stored in state'
  );
});
