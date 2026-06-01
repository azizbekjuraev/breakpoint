import App from './App';

test('input DOM element is preserved across state updates', async () => {
  render(<App />);
  await wait(20);

  const inputBefore = screen.container().querySelector('input');
  if (!inputBefore) throw new Error('No input rendered');

  fireEvent.change(inputBefore, { target: { value: 'a' } });
  await wait(50);

  const inputAfter = screen.container().querySelector('input');
  assert.equal(
    inputBefore,
    inputAfter,
    'The input was replaced with a new DOM element — defining a component inside another component creates a new component type on every render, which unmounts and remounts the subtree',
  );
});
