import { useState } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  function addTwo() {
    setCount(count + 1);
    setCount(count + 1);
  }

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={addTwo}>Add 2</button>
    </div>
  );
}
