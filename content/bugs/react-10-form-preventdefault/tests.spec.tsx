import App from './App';

test('submitting shows the confirmation without reloading', async () => {
  render(<App />);
  await wait(20);

  const input = screen.container().querySelector('input');
  if (!input) throw new Error('No input rendered');
  fireEvent.change(input, { target: { value: 'Alice' } });
  await wait(30);

  const form = screen.container().querySelector('form');
  if (!form) throw new Error('No form rendered');
  fireEvent.submit(form);
  await wait(100);

  assert.ok(
    screen.queryByText('Submitted: Alice'),
    '"Submitted: Alice" did not appear — without preventDefault, the browser submits the form normally and reloads the iframe',
  );
});
