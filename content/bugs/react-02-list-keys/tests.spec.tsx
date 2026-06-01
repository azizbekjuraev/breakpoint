import App from './App';

test('typing in a row stays with that row when a new item is added to the front', async () => {
  render(<App />);
  await wait(20);

  const c = screen.container();
  const inputs = c.querySelectorAll('input');

  fireEvent.change(inputs[1], { target: { value: 'hello' } });
  await wait(30);

  fireEvent.click(screen.getByText('Add to front'));
  await wait(50);

  const newInputs = c.querySelectorAll('input');
  assert.equal(newInputs.length, 4, 'Should have 4 inputs after adding');

  assert.equal(
    newInputs[2].value,
    'hello',
    'B\\'s input lost its value — using array index as the key makes state stick to position instead of moving with the item'
  );
  assert.equal(
    newInputs[1].value,
    '',
    'A\\'s input picked up B\\'s value — state should belong to the item, not the position'
  );
});
