import App from './App';

test('clicking "Log click" logs once per click', async () => {
  render(<App />);
  await wait(20);
  clearLogs();

  fireEvent.click(screen.getByText('Log click'));
  await wait(50);

  const logs = getLogs();
  assert.ok(
    logs.includes('button clicked'),
    'Click produced no log — onClick={logClick()} calls logClick during render and passes its return value (undefined) to onClick',
  );
});

test('re-rendering does not log without a click', async () => {
  render(<App />);
  await wait(20);
  clearLogs();

  fireEvent.click(screen.getByText('+'));
  await wait(50);

  const logs = getLogs();
  assert.ok(
    !logs.includes('button clicked'),
    'A re-render produced a "button clicked" log — logClick is being called on every render instead of on click',
  );
});
