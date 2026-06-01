import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  function addTwo() {
    setCount((c) => c + 1);
    setCount((c) => c + 1);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={addTwo}>Add 2</button>
    </div>
  );
}
