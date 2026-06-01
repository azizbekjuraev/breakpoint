import App from './App';

test('initial title is "Count: 0"', async () => {
  render(<App />);
  await wait(50);
  assert.equal(document.title, 'Count: 0', 'Title should reflect the initial count');
});

test('title updates to "Count: 3" after three clicks', async () => {
  render(<App />);
  await wait(20);
  const button = screen.getByText('+');

  // Small waits between clicks let React flush each render — otherwise all
  // three clicks fire with the same stale onClick closure (count=0) and only
  // a single state update lands. That's a separate React-18 batching subtlety;
  // for this bug we want to isolate the useEffect-deps lesson.
  fireEvent.click(button);
  await wait(20);
  fireEvent.click(button);
  await wait(20);
  fireEvent.click(button);
  await wait(50);

  assert.equal(
    document.title,
    'Count: 3',
    'Title did not update — the effect must re-run when count changes',
  );
});
