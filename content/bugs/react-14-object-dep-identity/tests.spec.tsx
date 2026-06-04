import App from './App';

test('effect runs once even after unrelated re-renders', async () => {
  render(<App />);
  await wait(20);
  fireEvent.click(screen.getByText(/Tick/));
  await wait(20);
  fireEvent.click(screen.getByText(/Tick/));
  await wait(20);
  fireEvent.click(screen.getByText(/Tick/));
  await wait(20);

  const runs = getLogs().filter((l) => l === 'config effect ran').length;
  assert.equal(
    runs,
    1,
    `Effect ran ${runs} times. The deps array compares by reference (Object.is), and an object literal inside render gets a new identity every time the component re-renders. Wrap it in useMemo, or depend on the primitive value directly.`,
  );
});
