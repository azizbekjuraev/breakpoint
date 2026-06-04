import App from './App';

test('count climbs over multiple interval ticks', async () => {
  render(<App />);
  await wait(200); // ~6 interval ticks at 30ms

  const node = screen.container()?.querySelector('p');
  const text = node?.textContent ?? '';
  const m = text.match(/Count: (\d+)/);
  const value = m ? parseInt(m[1], 10) : 0;

  assert.ok(
    value >= 3,
    `Count is ${value} after ~6 ticks — the interval callback is closing over the initial count (0), so it keeps calling setCount(1). Use the functional form of setCount to read the latest value.`,
  );
});

test('counter is not stuck at 1', async () => {
  render(<App />);
  await wait(200);

  const stuck = screen.queryByText('Count: 1');
  assert.ok(
    !stuck,
    'Counter is frozen at 1 — every interval tick reads count from the captured closure (always 0) and writes the same value. React skips the re-render because state did not change.',
  );
});
