import { useState, useEffect } from 'react';

export default function App() {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);
    }, 30);
    return () => clearInterval(id);
  }, []);

  return <p>Count: {count}</p>;
}
