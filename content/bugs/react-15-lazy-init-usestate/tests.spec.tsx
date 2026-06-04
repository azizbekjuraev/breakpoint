import App from './App';

test('initializer runs only once across many re-renders', async () => {
  render(<App />);
  await wait(20);
  fireEvent.click(screen.getByText('Tick'));
  await wait(20);
  fireEvent.click(screen.getByText('Tick'));
  await wait(20);
  fireEvent.click(screen.getByText('Tick'));
  await wait(20);

  const calls = getLogs().filter((l) => l === 'loadInitialItems called').length;
  assert.equal(
    calls,
    1,
    `loadInitialItems was called ${calls} times. useState only keeps the first call's result, but the function still runs on every render because JavaScript evaluates the () before passing it in. Pass the function reference, not the call.`,
  );
});

test('initial items are populated', async () => {
  render(<App />);
  await wait(20);

  const el = screen.queryByText('Items: 3');
  assert.ok(el, 'Items should be initialized to a 3-element array');
});
