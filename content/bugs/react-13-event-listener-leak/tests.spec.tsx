import App from './App';

test('one Ping increments count by exactly 1 after two id changes', async () => {
  render(<App />);
  await wait(20);
  fireEvent.click(screen.getByText('Change id'));
  await wait(20);
  fireEvent.click(screen.getByText('Change id'));
  await wait(20);
  fireEvent.click(screen.getByText('Ping'));
  await wait(50);

  const ok = screen.queryByText('Count: 1');
  assert.ok(
    ok,
    'A single Ping should increment count by 1, but the effect added a new listener on every id change without removing the previous one. Cleanup the listener in the effect\'s return.',
  );
});

test('count does not jump to 3 from a single Ping', async () => {
  render(<App />);
  await wait(20);
  fireEvent.click(screen.getByText('Change id'));
  await wait(20);
  fireEvent.click(screen.getByText('Change id'));
  await wait(20);
  fireEvent.click(screen.getByText('Ping'));
  await wait(50);

  const stale = screen.queryByText('Count: 3');
  assert.ok(
    !stale,
    'Three stale listeners fired for one event — the effect must remove the previous listener before adding a new one',
  );
});
