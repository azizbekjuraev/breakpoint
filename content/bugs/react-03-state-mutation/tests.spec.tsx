import App from './App';

test('Cherry appears in the list after clicking Add Cherry', async () => {
  render(<App />);
  await wait(20);

  assert.ok(screen.queryByText('Apple'), 'Apple should be in the initial list');
  assert.ok(!screen.queryByText('Cherry'), 'Cherry should not be in the initial list');

  fireEvent.click(screen.getByText('Add Cherry'));
  await wait(50);

  assert.ok(
    screen.queryByText('Cherry'),
    'Cherry did not appear — mutating items and calling setItems with the same reference does not trigger a re-render'
  );
});
