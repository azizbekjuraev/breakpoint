import App from './App';

test('most recent selection wins after rapid switches', async () => {
  render(<App />);
  // Initial mount: userId="1" (Bob), starts the slow 80ms fetch.
  await wait(5);
  fireEvent.click(screen.getByText('Load Alice'));
  // Wait long enough that both fetches have settled.
  await wait(200);

  const shown = screen.queryByText('User: Alice');
  assert.ok(
    shown,
    'Expected "User: Alice" — the last selection — but the slow Bob fetch from the previous selection resolved second and overwrote the displayed name',
  );
});

test('does not display the abandoned user', async () => {
  render(<App />);
  await wait(5);
  fireEvent.click(screen.getByText('Load Alice'));
  await wait(200);

  const stale = screen.queryByText('User: Bob');
  assert.ok(
    !stale,
    'Display shows "User: Bob" — the slow first fetch leaked through and overwrote the result. The previous effect needs a cleanup that cancels its setState.',
  );
});
