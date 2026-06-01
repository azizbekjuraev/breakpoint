import { useState } from 'react';

function logClick() {
  console.log('button clicked');
}

export default function App() {
  const [count, setCount] = useState(0);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={logClick()}>Log click</button>
      <button onClick={() => setCount((c) => c + 1)}>+</button>
    </div>
  );
}
