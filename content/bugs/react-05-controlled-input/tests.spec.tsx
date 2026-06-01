import App from './App';

test('typing in the input updates the greeting', async () => {
  render(<App />);
  await wait(20);

  const input = screen.container().querySelector('input');
  if (!input) throw new Error('No input rendered');

  fireEvent.change(input, { target: { value: 'Alice' } });
  await wait(50);

  assert.ok(
    screen.queryByText('Hello, Alice'),
    'The greeting did not update — when `value` is bound to state, you also need `onChange` to write back to state',
  );
});
