import { useState } from 'react';

function loadInitialItems(): string[] {
  console.log('loadInitialItems called');
  return ['apple', 'banana', 'cherry'];
}

export default function App() {
  const [items] = useState<string[]>(loadInitialItems);
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Items: {items.length}</p>
      <p>Count: {count}</p>
      <button onClick={() => setCount((c) => c + 1)}>Tick</button>
    </div>
  );
}
